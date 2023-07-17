from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager, PermissionsMixin
from django.core.validators import MinLengthValidator
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

import constants
from versioning_control.models import VersioningControl


class UserManager(BaseUserManager):
    """
    A class for PokerUserManager inheriting BaseUserManager.

    ...

    Methods
    ----------
    create_user(email, password, *args, **kwargs):
        creates a user instance, make an entry in database and then returns it
    create_superuser(email, password, **kwargs):
        calls create_user function and sets is_staff and is_superuser to true
    """
    use_in_migrations = True

    def create_user(self, email, password, *args, **kwargs):
        '''
        First creates a user if it doesn't exist and then returns the created user

                Parameters:
                        a (str): a string with email
                        b (str): a string with password

                Returns:
                        user (PokerUser): a PokerUser instance
        '''
        if not email:
            raise ValueError('Email not provided')
        email = self.normalize_email(email).lower()
        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **kwargs):
        '''
        Sets the is_staff and is_superuser field to true and then calls create_user function
        to create a new superuser

                Parameters:
                        a (str): a string with email
                        b (str): a string with password

                Returns:
                        user (PokerUser): a PokerUser instance
        '''
        kwargs.setdefault('is_staff', True)
        kwargs.setdefault('is_superuser', True)
        if kwargs.get('is_staff') is not True:
            raise ValueError('Superuser must have his staff status true')
        return self.create_user(email, password, **kwargs)


class PokerUser(VersioningControl, AbstractBaseUser, PermissionsMixin):
    """
    A class for PokerUser model.

    ...

    Fields
    ----------
    first_name : str
        stores first name of the user
    last_name : str
        stores last name of the user
    email : email
        stores email of the user
    is_staff : boolean
        tells if the user has is_staff status true or false
    is_superuser : boolean
        tells if the user has is_superuser status true or false
    is_verified : boolean
        stores the verification status of user post sign up
    phone_number: phone number field
        stores phone number of user
    address_line_1 : str
        stores address line 1 of user
    address_line_2 : str
        stores address line 2 of user
    zip_code : str
        stores zip code of location of user
    state : str
        stores state (as in state of India) of user
    city : str
        stores city of user
    gender : int
        stores gender integer choice for the user
    date_of_birth : date field
        stores dob of user
    """
    first_name = models.CharField(max_length=constants.NAME_MAX_LEN, null=True, blank=True)
    last_name = models.CharField(max_length=constants.NAME_MAX_LEN, null=True, blank=True)
    email = models.EmailField(
        'email address', unique=True, max_length=constants.CHARFIELD_MAX_LEN,
        validators=[MinLengthValidator(6)]
    )
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    phone_number = PhoneNumberField(unique=True, null=True, blank=True)
    address_line_1 = models.CharField(max_length=constants.CHARFIELD_MAX_LEN, null=True, blank=True)
    address_line_2 = models.CharField(max_length=constants.CHARFIELD_MAX_LEN, null=True, blank=True)
    zip_code = models.CharField(max_length=constants.ZIP_CODE_MAX_LEN, null=True, blank=True)
    state = models.CharField(max_length=constants.STATE_MAX_LEN, null=True, blank=True)
    city = models.CharField(max_length=constants.CITY_MAX_LEN, null=True, blank=True)
    gender = models.IntegerField(default=constants.genders.no_disclose, choices=constants.GENDER_CHOICES)
    date_of_birth = models.DateField(null=True, blank=True)
    jira_api_token = models.CharField(max_length=constants.CHARFIELD_MAX_LEN, null=True, blank=True)
    jira_domain = models.CharField(max_length=constants.CHARFIELD_MAX_LEN, null=True, blank=True)

    objects = UserManager()

    class Meta:
        """
        A class to describe extra properties of this PokerUser model

        ...

        Has a verbose name of User which is shown in django-admin
        """
        verbose_name = "User"

    USERNAME_FIELD = 'email'

    @property
    def check_jira_credentials(self):
        """
        Checks if the users jira credentials are not empty.

        :return: True if the jira_domain and jira_api_token are not empty, False otherwise.
        :rtype: bool
        """
        return self.jira_domain and self.jira_api_token
