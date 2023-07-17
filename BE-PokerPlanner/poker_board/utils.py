from os import environ as env

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.core.signing import BadSignature, Signer
from os import environ as env
from poker_board import constants

signer = Signer()


@shared_task
def send_invite_mail(pokerboard, recipients):
    '''
    Sends an email invitation to the specified recipients for the given pokerboard.

    Parameters:
    -----------
    pokerboard : str
        The name or identifier of the pokerboard for which the invitation is being sent.
    recipients : list of str
        The email addresses of the recipients to whom the invitation is being sent.

    Returns:
    --------
    None

    Raises:
    -------
    None

    Example:
    --------
    To send an invitation email to two recipients with the pokerboard name "my_pokerboard", use the following code:

    recipients = ['recipient1@example.com', 'recipient2@example.com']
    send_invite_mail('my_pokerboard', recipients)
    '''
    for user in recipients:
        email_paramas = signer.sign(user)
        pokerboard_id = signer.sign(pokerboard)
        invite_link = f'{env.get("REACT_URL")}/boards/{pokerboard}/?operation=acceptinvite&accept_invite_email={email_paramas}&pokerboard_id={pokerboard_id}'
        
        send_mail(
            subject='Invite Link',
            message=invite_link,
            from_email=settings.EMAIL_HOST_USER, 
            recipient_list=[user],
            fail_silently=False
        )


def decrypt_mail_parames(encrpyted_email, encrpyted_pokerboard_id):
    '''
    Decrypts the encrypted email and pokerboard_id received in an invitation link.

    Parameters:
    -----------
    encrypted_email : str
        The encrypted email address of the invite recipient.
    encrypted_pokerboard_id : str
        The encrypted ID of the pokerboard to which the invite is being sent.

    Returns:
    --------
    dict
        A dictionary containing the decrypted email and pokerboard_id.

    Raises:
    -------
    BadSignature
        If the email and/or pokerboard_id cannot be decrypted.

    Example:
    --------
    To decrypt the email and pokerboard_id received in an invitation link, use the following code:

    encrypted_email = 'ABC123'
    encrypted_pokerboard_id = 'DEF456'
    decrypted_params = decrypt_mail_params(encrypted_email, encrypted_pokerboard_id)
    email = decrypted_params['email']
    pokerboard_id = decrypted_params['pokerboard_id']
    '''
    try:
        email = signer.unsign(encrpyted_email)
        pokerboard_id = signer.unsign(encrpyted_pokerboard_id)
        return {"email": email, "pokerboard_id": pokerboard_id}
    except BadSignature:
        raise BadSignature(constants.DATA_NOT_DECRPTED)
