from datetime import datetime
from os import environ as env

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from rest_framework_multitoken.models import MultiToken

from poker_user import constants as poker_user_constants


def isTokenExpire(token):
    '''
    Check Wheather token is expire or not
    '''
    return \
        (datetime.now().timestamp() - token.created.timestamp()) > poker_user_constants.EXPIRY_TIME


def revive_token(token):
    '''
    If token is expire it update the expire time of token
    '''
    token.created = datetime.now()
    token.save(update_fields=['created'])
    return token


def token_revive_or_generate(user):
    '''
    Generate token if not exist else update it's expiry time
    '''
    token, _ = MultiToken.objects.get_or_create(user=user)
    if(isTokenExpire(token)):
        token.delete()
        token = MultiToken.objects.create(user=user)
        return token
    else:
        return revive_token(token)


class VerificationEmailTemplate:
    """
    Template for verification mail
    
    ....

    Fields
    ---------
    From : sender email id from settings
    subject : subject of email
    """
    From = settings.EMAIL_HOST_USER
    subject = 'Your accounts need to be verified'

    @shared_task
    def send_mail_after_registration(email, token):
        recipient_list = [email]
        verification_link = f'Activation link : {env.get("REACT_URL")}/verify?token={token}'
        
        send_mail(
            VerificationEmailTemplate.subject,
            verification_link,
            VerificationEmailTemplate.From, recipient_list,fail_silently=False
        )

