from django.db.models import Q, Count
from rest_framework import serializers

import constants
from poker_board.models import PokerBoard, PokerRole
from poker_board import (
    constants as poker_board_constants, 
    utils as poker_board_utils
)
from poker_group.serializers import PokerGroup, PokerGroupSerializer
from poker_ticket.serializers import TicketSerializer
from poker_user.models import PokerUser
from poker_user.serializers import MemberSerializer


class PokerBoardSerializer(serializers.ModelSerializer):
    """
    A serializer class to serialize the complete data of a board.
    Also has custom functions to add/remove members and groups to a board.
    """
    groups = PokerGroupSerializer(source='poker_group_board', many=True, read_only=True)
    group_names = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    manager = MemberSerializer(required=False)
    users = MemberSerializer(many=True, read_only=True)
    user_emails = serializers.ListField(child=serializers.EmailField(), write_only=True, required=False)
    voting_system_name = serializers.CharField(source='get_voting_system_display', required=False)
    voting_system = serializers.IntegerField(write_only=True)
    poker_ticket = TicketSerializer(read_only=True, many=True)
    estimated_tickets_cnt = serializers.SerializerMethodField(required=False)

    class Meta:
        """
        A meta class for PokerBoardSerializer that contains extra properties used in it
        ....
        attributes
        ------------
        model : tells what model to use for this serializer
        fields : tells which fields to use when serializing response
        extra_kwargs : tells what extra properties each field can have
        """
        model = PokerBoard
        exclude = ['created_at', 'updated_at']
        extra_kwargs = {
            'poker_ticket': { 'required': False }
        }
    
    def get_estimated_tickets_cnt(self, obj):
        """
        A function to get the count of all the estimated tickets of the board
        """
        return obj.poker_ticket.filter(is_estimated=True).count()

    @staticmethod
    def add_users(instance, member_emails):
        '''
        custom function used to add users in the board
                Parameters:
                        a (PokerBoard): a PokerBoardInstance
                        b (list): a list with mails of users to be added
        '''
        existing_members = PokerUser.objects.filter(email__in=member_emails).values('email', 'id')
        existing_member_emails = {member['email'] for member in existing_members}
        existing_member_ids = {member['id'] for member in existing_members}
        new_users = [PokerUser(email=email) for email in set(member_emails) - existing_member_emails]
        PokerUser.objects.bulk_create(new_users)
        instance.users.add(*(existing_member_ids | {user.id for user in new_users}))
    
    def remove_users(self, instance, user_emails):
        '''
        custom function used to remove members from the group
                Parameters:
                        a (PokerGroup): a PokerGroupInstance
                        b (list): a list with mails of members need to be added
        '''
        existing_members = PokerUser.objects.filter(
            Q(email__in=user_emails) & ~Q(email=instance.manager.email)
        ).values_list('id', flat=True)
        instance.users.remove(*existing_members)

    def add_groups(self, instance, group_names):
        '''
        custom function used to add groups to the board
        also adds the members of the groups to the board
                Parameters:
                        a (PokerBoard): a PokerBoardInstance
                        b (list): a list with ids of groups to be added
        '''
        groups = PokerGroup.objects.filter(name__in=group_names).prefetch_related('members').values(
            'id', 'members__email'
        ).distinct('members__email')
        groups_to_add = [group['id'] for group in groups]
        members_to_add = [
            group['members__email'] for group in groups if group['members__email'] is not None
        ]
        instance.poker_group_board.add(*groups_to_add)
        self.add_users(instance, members_to_add)

    def get_groups_of_board(self, instance):
        '''
        custom function used to get all the groups which are part of the board instance
                Parameters:
                        a (PokerBoard): a PokerBoardInstance
                
                Returns:
                        (queryset): queryset with all the groups present in the board
        '''
        return instance.poker_group_board.all().values_list('id', flat=True)

    def remove_groups(self, instance, group_names):
        '''
        custom function used to remove members from the group
        also removes the users from the board present in the group
        handles the case where same users from multiple groups will remain unchanged
                Parameters:
                        a (PokerGroup): a PokerGroupInstance
                        b (list): a list of one item with the group to be removed
        '''
        groups_to_remove = PokerGroup.objects.filter(name__in=group_names).values_list('id', flat=True)
        members = PokerGroup.objects.get(name=group_names[0]).members.all().values_list('id', flat=True)
        users_to_remove = list(instance.users.annotate(
            group_cnt=Count(
                'poker_group_user',
                filter=Q(poker_group_user__id__in=self.get_groups_of_board(instance))
            )
        ).filter(
            Q(id__in=members), Q(group_cnt__lt=constants.GROUP_CNT_LIMIT)
        ).values_list('email', flat=True))
        instance.poker_group_board.remove(*groups_to_remove)
        self.remove_users(instance, users_to_remove)
    
    def validate(self, attrs):
        attrs['manager'] = self.context['request'].user
        return super().validate(attrs)

    def create(self, validated_data):
        user_emails = validated_data.pop('user_emails', [])
        group_names = validated_data.pop('group_names', [])
        board_instance = super().create(validated_data)
        user_emails.append(self.context['request'].user.email)
        self.add_users(board_instance, user_emails)
        self.add_groups(board_instance, group_names)
        return board_instance

    def update(self, instance, validated_data):
        super().update(instance, validated_data)
        user_emails = validated_data.pop('user_emails', [])
        group_names = validated_data.pop('group_names', [])
        options = {
            'add_members': {'method': self.add_users, 'parameter': user_emails},
            'remove_members': {'method': self.remove_users, 'parameter': user_emails},
            'add_groups': {'method': self.add_groups, 'parameter': group_names},
            'remove_groups': {'method': self.remove_groups, 'parameter': group_names},
        }
        query_params = self.context['request'].query_params
        chosen_operation = options.get(query_params.get('operation', ''), None)
        if chosen_operation is not None:
            chosen_operation['method'](instance, chosen_operation['parameter'])
        return instance


class UserBoardFetchSerializer(serializers.ModelSerializer):
    """
      This serializer returns the fields that need to be displayed on the board section of user profile
    """
    voting_system = serializers.CharField(source='get_voting_system_display')
    manager_first_name = serializers.CharField(source="manager.first_name")
    manager_last_name = serializers.CharField(source="manager.last_name")

    class Meta:
        model = PokerBoard
        exclude = ['created_at', 'updated_at']


class LoggedInUserBoardsSerializer(serializers.ModelSerializer):
    """
    To get serialized data of all the boards that the logged in user is associated with
    """
    boards = UserBoardFetchSerializer(
      source="board", many=True
      )

    class Meta:
        model = PokerUser
        fields = ["id", "boards"]


class PokerRoleChangeSerializer(serializers.ModelSerializer):
    """
    Serializer to change the role of members of the pokerboard
    """
    class Meta:
        model = PokerRole
        fields = ['user', 'role']


class PokerRoleSerializer(PokerRoleChangeSerializer):
    """
    Serializer to get the roles of all the members of the pokerboard
    """
    user_email = serializers.EmailField(source='user')
    
    class Meta:
        model = PokerRole
        fields = PokerRoleChangeSerializer.Meta.fields + ['user_email']


class InviteSerailizer(serializers.Serializer):
    """
    A serializer which invite user for join in pokerboard.
    it take common members from explicity invite user and group members and send mail to them.
    """
    group_names = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    user_emails = serializers.ListField(child=serializers.EmailField(), write_only=True, required=False)

    def update(self, instance, validated_data):
        users_email = validated_data.pop('user_emails','')
        group_names = validated_data.pop('group_names','')
        groups = PokerGroup.objects.filter(name__in=group_names).prefetch_related('members').values(
            'members__email', 'admin__email'
        )
        groups_members_to_add = {
            group['admin__email'] for group in groups
        } | {group['members__email'] for group in groups}
        
        invite_members =  list(groups_members_to_add | set(users_email))
        poker_board_utils.send_invite_mail.delay(instance.id, invite_members)
        return instance


class AcceptInviteSerailizer(serializers.Serializer):
    """
    Accept Invite mail extract query params from url link and decrpyted them using project secret key.
    and match decrpyted data with original.

    check wheater invite user is exists or not.
    in case of user does not exists it create instance of smae user in database.
    """

    def validate(self, attrs):
        encrypted_email = self.context['request'].query_params.get('accept_invite_email','')
        encrypted_pokerboard_id = self.context['request'].query_params.get('pokerboard_id','')

        try:
            attrs = poker_board_utils.decrypt_mail_parames(encrypted_email, encrypted_pokerboard_id)
        except: 
            raise serializers.ValidationError(poker_board_constants.DATA_NOT_DECRPTED)        
        user = PokerUser.objects.filter(email = attrs['email']).first()
        attrs['user'] = user
        pokerboard_user = self.context['view'].get_queryset().first().users.filter(email = attrs['email'])
        email = encrypted_email.split(":")[0]
        pokerboard_id = encrypted_pokerboard_id.split(":")[0]
        
        auth_user_email = self.context['request'].user.email

        if auth_user_email != attrs['email'] or pokerboard_id != attrs['pokerboard_id'] or email != attrs['email']:
            raise serializers.ValidationError(poker_board_constants.NOT_INVITE)
        elif pokerboard_user.exists():
            raise serializers.ValidationError(poker_board_constants.POKERBOARD_EXIST)
        return attrs

    def update(self, instance, validated_data):
        PokerUser.objects.update_or_create(email=validated_data['user'].email)
        PokerBoardSerializer.add_users(instance, [validated_data['email']])
        return instance
