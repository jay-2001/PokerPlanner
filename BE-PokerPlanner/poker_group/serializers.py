from rest_framework import serializers

from constants import MEMBER_OPERATIONS
from poker_group.models import PokerGroup
from poker_user.models import PokerUser
from poker_user.serializers import MemberSerializer


class UserGroupFetchSerializer(serializers.ModelSerializer):
    """
      This serializer returns the fields that need to be displayed on the group section of user profile
    """
    admin_first_name = serializers.CharField(source='admin.first_name')
    admin_last_name = serializers.CharField(source='admin.last_name')

    class Meta:
        model = PokerGroup
        exclude = ['created_at', 'updated_at', 'boards']


class PokerGroupSerializer(serializers.ModelSerializer):
    """
    A serializer class to serialize the complete data of a group.
    Also has custom functions to add and remove members in group.
    """
    member_emails = serializers.ListField(child=serializers.EmailField(), write_only=True, required=False)
    members = MemberSerializer(many=True, read_only=True)
    admin = MemberSerializer(required=False)

    class Meta:
        """
        A meta class for MemberSerializer that contains extra properties used in it

        ....

        attributes
        ------------
        model : tells what model to use for this serializer
        fields : tells which fields to use when serializing response
        extra_kwargs : tells what extra properties each field can have
        """
        model = PokerGroup
        fields = ['id', 'name', 'admin', 'description', 'members', 'member_emails']

    def remove_members(self, group_instance, member_emails):
        '''
        custom function used to remove members from the group

                Parameters:
                        a (PokerGroup): a PokerGroupInstance
                        b (list): a list with mails of members need to be added

                Returns:
                        group_instance (PokerGroup): PokerGroup instance
        '''
        existing_members = PokerUser.objects.filter(email__in=member_emails).values_list('id', flat=True)
        group_instance.members.remove(*existing_members)

    def add_members(self, group_instance, member_emails):
        '''
        custom function used to add members in the group
                Parameters:
                        a (PokerGroup): a PokerGroupInstance
                        b (list): a list with mails of members need to be added
                Returns:
                        group_instance (PokerGroup): PokerGroup instance
        '''
        existing_members = PokerUser.objects.filter(email__in=member_emails).values('email', 'id')
        existing_member_emails = {member['email'] for member in existing_members}
        existing_member_ids = {member['id'] for member in existing_members}
        new_users = [PokerUser(email=email) for email in set(member_emails) - existing_member_emails]
        PokerUser.objects.bulk_create(new_users)
        group_instance.members.add(*(existing_member_ids | {user.id for user in new_users}))

    def validate(self, attrs):
        attrs['admin'] = self.context['request'].user
        return super().validate(attrs)

    def create(self, validated_data):
        member_emails = validated_data.pop('member_emails', [])
        group_instance = super().create(validated_data)
        self.add_members(group_instance, member_emails)
        return group_instance

    def update(self, instance, validated_data):
        super().update(instance, validated_data)
        member_emails = validated_data.pop('member_emails', [])
        query_params = self.context['request'].query_params
        if query_params.get('operation', '') == MEMBER_OPERATIONS['ADD_MEMBERS']:
            self.add_members(instance, member_emails)
        elif query_params.get('operation', '') == MEMBER_OPERATIONS['REMOVE_MEMBERS']:
            self.remove_members(instance, member_emails)
        return instance
