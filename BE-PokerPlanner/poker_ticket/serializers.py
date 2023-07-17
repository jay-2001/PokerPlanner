from django.core import validators
from rest_framework import serializers

import constants
from jira_integration.jiras import JiraIntegration
from poker_ticket import constants as ticket_constants
from poker_ticket import models as ticket_models


class TicketSerializer(serializers.ModelSerializer):
    """
    This serializer serializes data for the ticket details
    """
    class Meta:
        model = ticket_models.Ticket
        exclude = ["created_at", "updated_at", "user_estimation"]


class UserTicketFetchSerializer(serializers.ModelSerializer):
    """
    This serializer serializes data on through table of user and ticket and uses nested serializer
    to fetch the ticket details
    """
    ticket_detail = TicketSerializer(source="ticket")
    
    class Meta:
        model = ticket_models.PokerUserEstimation
        exclude = ["created_at", "updated_at", "user", "ticket"]

class UserTicketEstimationSerializer(serializers.ModelSerializer):
    """
    This serializer serializes data for a ticket instance and is being used in websocket consumer
    """
    class Meta:
        model = ticket_models.Ticket
        exclude = ["created_at", "updated_at"]


class TicketValidationSerializer(serializers.ModelSerializer):
    """
    To serializer JIRA ticket and make validation on fields as per we mention validation in models
    """
    class Meta:
        model = ticket_models.Ticket
        fields = ['jira_ticket', 'summary', 'description', 'final_estimation', 'pokerboard']


class FetchJiraTicketSerializer(serializers.Serializer):
    """
    [1]. Serialzer fetch jira tickets and add it to the Ticket Table
    
    [2]. Make validations that user should not have jira_domain and jira_token empty
    
    [3]. It authenticate user using jira credentials and if he is authroized user 
    than and only than we fetch jira ticket or raise validation Error
    """
    jira_query_params = serializers.CharField(write_only = True)

    def validate(self, validated_data):
        '''
        If user jira_token and jira_api_token fields is empty
        it raise error this field should not be empty.
        '''
        user = self.context['request'].user

        if not user.check_jira_credentials:
            raise serializers.ValidationError(ticket_constants.USER_NOT_FILL_JIRA_DETAILS)
        
        return validated_data

    def validate_jira_query_params(self, validated_data):
        '''
        validate the jira_query_params data it validate that is operationable or not.
        and authenticate user with jira_credentials 
        '''
        try:
            user = self.context['request'].user
            jira = JiraIntegration(user.jira_domain,user.email,user.jira_api_token)
            auth_user = jira.jira_authentication()
            validated_data = self.structure_jira_data(auth_user, validated_data)
            return validated_data
        except:
            raise serializers.ValidationError(ticket_constants.INVALID_JIRA_CREDENTIALS)
    
    def get_jira_data(self, jira, operation, jira_query_data):
        '''
        it call apis of jira according to query params data.
        
        -------------------------
        Need of query params.
        Reason: If user does not provide query params so we do not call any apis.
                other we need to filter data and perform action according to query params operation.
        '''
        jira_data = []
        if operation == constants.JIRA_OPERATIONS['SPRINT']:
            jira_data = JiraIntegration.jira_sprint(jira, jira_query_data)
        elif operation == constants.JIRA_OPERATIONS['TICKET']:
            jira_data = JiraIntegration.jira_ticket(jira, jira_query_data)
        elif operation == constants.JIRA_OPERATIONS['JQL']:
            jira_data = JiraIntegration.jira_ticket_sql(jira, jira_query_data)
        
        return jira_data
    
    def structure_jira_data(self, jira, attrs):
        '''
        it structure data from jira raw data.
        '''
        
        pokerboard = self.context['pokerboard']
        operation = self.context['request'].query_params['operation']
        data = self.get_jira_data(jira, operation, attrs)
        data = list(map(lambda value: {**value, 'pokerboard': pokerboard}, data))
        return data
    
    def create(self, validated_data):
        serializer = TicketValidationSerializer(data = validated_data['jira_query_params'], many = True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return validated_data


class CommentTicketSerializer(serializers.Serializer):
    """
    A serializer for adding comments to Jira issues.
    Attributes:
        issue_key (str): The key of the Jira issue to add the comment to.
        comment_body (str): The text of the comment to add.
    """
    issue = serializers.CharField(validators = [validators.MaxLengthValidator(100)])
    comments = serializers.CharField(validators = [validators.MaxLengthValidator(300)])
    
    def validate(self, validated_data):
        '''
        If user jira_token and jira_api_token fields is empty
        it raise error this field should not be empty.
        it checks that ticket is exist or not with given ticket id or not.
        '''
        user = self.context['request'].user
        if not user.check_jira_credentials:
            raise serializers.ValidationError(ticket_constants.USER_NOT_FILL_JIRA_DETAILS)
        
        if not ticket_models.Ticket.objects.filter(jira_ticket = validated_data['issue']).exists():
            raise serializers.ValidationError(ticket_constants.TICKET_NOT_EXIST)
        
        return validated_data
  
    def create(self, validated_data):
        '''
        Return issue id and comment data if comment is added successfully to ticket.
        Args:
            validated_data (dict): A dictionary containing the validated data from the serializer.
        Returns:
            dict: The validated data from the serializer.
        '''
        user = self.context['request'].user
        jira = JiraIntegration(user.jira_domain,user.email,user.jira_api_token)
        auth_user = jira.jira_authentication()
        JiraIntegration.jira_ticket_comment(auth_user, validated_data['issue'], validated_data['comments'])
        return validated_data


class TicketEstimationSerializer(serializers.Serializer):
    estimation = serializers.IntegerField(write_only=True)

    def validate(self, validated_data):
        '''
        If user jira_token and jira_api_token fields is empty
        it raise error this field should not be empty.
        it checks that ticket is exist or not with given ticket id or not.
        '''
        user = self.context['request'].user
        if not user.check_jira_credentials:
            raise serializers.ValidationError(ticket_constants.USER_NOT_FILL_JIRA_DETAILS)
        
        return validated_data

    def update(self, instance, validated_data):
        user = self.context['request'].user
        jira = JiraIntegration(user.jira_domain, user.email, user.jira_api_token)
        auth_user = jira.jira_authentication()
        JiraIntegration.jira_ticket_estimation(auth_user, instance.jira_ticket, validated_data['estimation'])
        return instance

class PokerBoardEstimatedTicketSerializer(serializers.ModelSerializer):
    """
    A serializer to get the jira_ ticket field of estimated tickets 
    """
    class Meta:
        model = ticket_models.Ticket
        fields = ['jira_ticket']
