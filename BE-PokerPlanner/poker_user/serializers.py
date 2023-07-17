import time

from django.contrib.auth import authenticate
from rest_framework import fields as rest_fields
from rest_framework import serializers
from rest_framework_multitoken.models import MultiToken

from poker_ticket import serializers as poker_ticket_serializers
from poker_user import utils
from poker_user.models import PokerUser


class SignUpSerializer(serializers.ModelSerializer):
    """
    Serializer of signup functionality for poker user
    
    ----------
    update: when user data is already exist in databse
    create: create new user in database
    """
    email = rest_fields.EmailField()

    def validate(self, attrs):
        user = PokerUser.objects.filter(email=attrs['email']).first()
        if user and user.is_verified:
            raise serializers.ValidationError('User already exists.')
        return super().validate(attrs)

    def create(self, validated_data):
        user = PokerUser.objects.filter(email=validated_data['email']).first()

        if user:
            user = super().update(user, validated_data)
            user.set_password(validated_data['password'])
            user.save(update_fields=['password'])
        else:
            user = PokerUser.objects.create_user(**validated_data)
    
        token = utils.token_revive_or_generate(user)
        time.sleep(3)
        utils.VerificationEmailTemplate.send_mail_after_registration.delay(user.email, token.key)
        return user

    class Meta:
        model = PokerUser
        exclude = ['is_staff', 'is_superuser', 'is_verified']

    
class VerificationSerializer(serializers.ModelSerializer):
    """
    VerificationSerializer of signup functionality for poker user
    
    ----------
    it set is_verfied field True
    """

    def validate(self, attrs):
        instance = MultiToken.objects.filter(key=self.initial_data['token']).first()
        if instance and not instance.user.is_verified and not utils.isTokenExpire(instance):
            return super().validate(attrs)
        else:
            raise serializers.ValidationError('Unathuorized User')

    def update(self, instance, validated_data):
        instance.user.is_verified = True
        instance.user.save(update_fields=['is_verified'])
        return instance 

    class Meta:
        model = MultiToken
        fields = ['key', 'user_id']


class LoginSerializer(serializers.Serializer):
    """
    LoginSerializer of signup functionality for poker user
    
    ----------
    it validate that user is authenticate or not
    """
    def validate(self, attrs):
        user = authenticate(email=str(self.initial_data['email']).lower(), password=self.initial_data['password'])
        if not user or (user and not user.is_verified):
            raise serializers.ValidationError('Invalid credentials or user is not verified')
        token = MultiToken.objects.create(user=user)
        attrs['token'] = token.key
        attrs['user_id'] = token.user_id
        return attrs


class LogoutSerializer(serializers.Serializer):
    """
    It delete token of authorized user
    """
    token = serializers.CharField()

    def perform_destroy(self, validated_data):
        token = validated_data['token']
        MultiToken.objects.get(key=token).delete()


class MemberSerializer(serializers.ModelSerializer):
    """
    A serializer class to serialize the members and admin of a group.
    """
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
        model = PokerUser
        exclude = [
            'last_login', 'created_at', 'updated_at', 'is_staff', 'is_superuser', 'is_verified',
            'groups', 'user_permissions'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }


class LoggedInUserProfileSerializer(serializers.ModelSerializer):
    """
    To fetch all the details of the user and update the fields
    """
    email = serializers.EmailField(read_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = PokerUser
        exclude = [
            "last_login",
            "created_at",
            "updated_at",
            "is_staff",
            "is_superuser",
            "is_verified",
            "groups",
            "user_permissions",
        ]

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        instance.set_password(validated_data.get("password", instance.password))
        instance.save(update_fields=["password"])
        return instance
