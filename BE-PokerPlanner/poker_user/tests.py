from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework_multitoken.models import MultiToken


class UserRegistrationAPIViewTestCase(APITestCase):
    """
        Test cases for Registration.
    """
    url = reverse('poker_user:register')

    def test_user_registration(self):
        '''
        Test to verify that a post call with user valid data.
        '''
        user_data = {
            'first_name': 'jay',
            'last_name': 'patel',
            'phone_number': '1234567890',
            'email' : 'a106@gmail.com',
            'password': '1',
            'address_line_1': '1',
            'address_line_2': '1',
            'zip_code':'392001'
        }
        response = self.client.post(self.url, user_data)
        self.assertEqual(201, response.status_code)
    
    def test_user_registration_invalid_data(self):
        '''
        Test to verify that a post call with user invalid data.
        '''
        user_data = {
            'last_name': 'patel',
            'phone_number': '1234567890',
            'email' : 'a106@gmail.com',
            'password': '1',
            'address_line_1': '1',
            'address_line_2': '1',
            'zip_code':'392001'
        }
        response = self.client.post(self.url, user_data)
        self.assertEqual(201, response.status_code)

    def test_unique_email_validation_account_is_not_verified(self):
        '''
        Test to verify that a post call with already exists email and verfication link not expire.
        '''
        user_data_1 = {
            'first_name': 'jay',
            'last_name': 'patel',
            'phone_number': '1234567890',
            'email' : 'a106@gmail.com',
            'password': '1',
            'address_line_1': '1',
            'address_line_2': '1',
            'zip_code':'392001',
        }
        response = self.client.post(self.url, user_data_1)
        self.assertEqual(201, response.status_code)

        user_data_2 = {
            'first_name': 'jay',
            'last_name': 'patel',
            'phone_number': '1234567890',
            'email' : 'a106@gmail.com',
            'password': '1',
            'address_line_1': '1',
            'address_line_2': '1',
            'zip_code':'392001'
        }
        response = self.client.post(self.url, user_data_2)
        self.assertEqual(201, response.status_code)

    def test_email_verfiaction_link_is_already_send_validation(self):
        '''
        Test to verify that a post call with already exists email and verification link is expire.
        '''
        user_data_1 = {
            'first_name': 'jay',
            'last_name': 'patel',
            'phone_number': '1234567890',
            'email' : 'a106@gmail.com',
            'password': '1',
            'address_line_1': '1',
            'address_line_2': '1',
            'zip_code':'392001'
        }
        response = self.client.post(self.url, user_data_1)
        self.assertEqual(201, response.status_code)

        user_data_2 = {
            'first_name': 'jay',
            'last_name': 'patel',
            'phone_number': '1234567890',
            'email' : 'a106@gmail.com',
            'password': '1',
            'address_line_1': '1',
            'address_line_2': '1',
            'zip_code':'392001'
        }
        response = self.client.post(self.url, user_data_2)
        self.assertEqual(201, response.status_code)


class UserLoginAPIViewTestCase(APITestCase):
    """
        Test case for Login
    """
    url = reverse('poker_user:login')

    def setUp(self):
        self.email = 'john@snow.com'
        self.password = 'you_know_nothing'
        self.user = get_user_model().objects.create_user(self.email, self.password)
        self.token = MultiToken.objects.create(user=self.user)

    def test_authentication_without_password(self):
        '''
        Test for login without password.
        '''
        response = self.client.post(self.url, {'email': self.email})
        self.assertEqual(400, response.status_code)

    def test_authentication_with_wrong_password(self):
        '''
        Test for login with wrong password.
        '''
        response = self.client.post(self.url, {'email': self.email, 'password': 'I_know'})
        self.assertEqual(400, response.status_code)

    def test_authentication_with_valid_data_not_verified(self):
        '''
        Test for login with without verified account.
        '''
        response = self.client.post(self.url, {'email': self.email, 'password': self.password})
        self.assertEqual(400, response.status_code)

    def test_authentication_with_valid_data_verified(self):
        '''
        Test for login with with verified account.
        '''
        self.user.is_verified = True
        response = self.client.post(self.url, {'email': self.email, 'password': self.password})
        self.assertEqual(200, response.status_code)
