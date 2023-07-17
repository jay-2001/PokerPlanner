from ddf import F, G
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_multitoken.models import MultiToken

from poker_group.models import PokerGroup
from poker_user.serializers import MemberSerializer, PokerUser


class GroupAPITestCases(APITestCase):
    '''
    This is a test case for a group API.
    It tests the behavior of creating, deleting and adding members to a group.

    Here are the details of the tests:
        `test_create_group_without_token`:
            checks if a group can be created without authentication credentials.
            Expected behavior is that the group should not be created.

        `test_create_group_with_valid_credentials`:
            checks if a group can be created by an authenticated user.
            Expected behavior is that the group should be created.

        `test_create_group_without_name`:
            checks if a group can be created without a name.
            Expected behavior is that the group should not be created.

        `test_create_group_without_description`:
            checks if a group can be created without a description.
            Expected behavior is that the group should be created.

        `test_delete_group_without_token`:
            checks if a user without a token can delete the group or not.
            Expected behavior is that the group should not be deleted.

        `test_delete_group_with_token`:
            checks if an admin can delete the group or not.
            Expected behavior is that the group should be deleted.

        `test_create_group_with_same_name`:
            checks if a user can create two groups with the same name or not.
            Expected behavior is that the group should not be created.

        `test_add_members_to_existing_group`:
            checks if an admin can add members to the group or not.
            Expected behavior is that members should be added to the group regardless of
            whether they exist in the system or not.
    '''
    groups_url = reverse('groupapi-list')
    group_data = {
        'name': 'group1',
        'description': 'new_description',
    }

    def test_create_group_without_token(self):
        """
        Test case to check if a group can be created without authentication credentials

        Expected behaviour
        ----------------
        Group should not get created
        """
        response = self.client.post(self.groups_url, self.group_data)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_create_group_with_valid_credentials(self):
        """
        Test case to check if a group can be created by an authenticated user

        Expected behaviour
        ----------------
        Group should get created
        """
        token = G(MultiToken, user=F(name='user1'))
        response = self.client.post(
            self.groups_url, self.group_data, **{'HTTP_AUTHORIZATION': f' Token {token.key}'}
        )
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(self.group_data['name'], response.data.get('name'))
        self.assertEqual(self.group_data['description'], response.data.get('description'))

    def test_create_group_without_name(self):
        """
        Test case to check if a group can be created without name or not

        Expected behaviour
        ----------------
        Group should not get created
        """
        token = G(MultiToken, user=F(name='user1'))
        group_data = {
            'description': 'new_description',
        }
        response = self.client.post(
            self.groups_url, group_data, **{'HTTP_AUTHORIZATION': f' Token {token.key}'}
        )
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    def test_create_group_without_description(self):
        """
        Test case to check if a group can be created without group description

        Expected behaviour
        ----------------
        Group should get created
        """
        token = G(MultiToken, user=F(name='user1'))
        group_data = {
            'name': 'group1',
        }
        response = self.client.post(
            self.groups_url, group_data, **{'HTTP_AUTHORIZATION': f' Token {token.key}'}
        )
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(group_data['name'], response.data.get('name'))

    def test_delete_group_without_token(self):
        """
        Test case to check if a user without token can delete the group or not

        Expected behaviour
        ----------------
        Group should not get deleted
        """
        group = G(PokerGroup, admin=F(name='user1'))
        response = self.client.delete(f'{self.groups_url}{group.id}/')
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_delete_group_with_token(self):
        """
        Test case to check if an admin can delete the group or not

        Expected behaviour
        ----------------
        Group should get created
        """
        user = G(PokerUser)
        token, group =  G(MultiToken, user=user), G(PokerGroup, admin=user)
        response = self.client.delete(
            f'{self.groups_url}{group.id}/', **{'HTTP_AUTHORIZATION': f' Token {token.key}'}
        )
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)

    def test_create_group_with_same_name(self):
        """
        Test case to check if a user can create two groups with same name or not

        Expected behaviour
        ----------------
        Group should not get created
        """
        token = G(MultiToken, user=F(name='user2'))
        response = self.client.post(
            self.groups_url, self.group_data, **{'HTTP_AUTHORIZATION': f' Token {token.key}'}
        )
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        response = self.client.post(
            self.groups_url, self.group_data, **{'HTTP_AUTHORIZATION': f' Token {token.key}'}
        )
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    def test_add_members_to_existing_group(self):
        """
        Test case to check if an admin can add members to the group or not

        Expected behaviour
        ----------------
        Members should get added to the group regardless they exist in system or not
        """
        token = G(MultiToken, user=F(name='user2'))
        user_1, user_2 = G(PokerUser), G(PokerUser)
        response = self.client.post(
            self.groups_url, self.group_data, **{'HTTP_AUTHORIZATION': f' Token {token.key}'}
        )
        users_to_add = {
            'member_emails': [
                user_1.email,
                user_2.email,
            ]
        }
        added_user_1 = MemberSerializer(user_1).data
        added_user_2 = MemberSerializer(user_2).data
        response = self.client.patch(
            '{}{}/?operation=add_members'.format(self.groups_url, response.data.get('id')),
            users_to_add, **{'HTTP_AUTHORIZATION': f' Token {token.key}'}
        )
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(2, len(response.data.get('members')))
        self.assertEqual(added_user_1, response.data.get('members')[0])
        self.assertEqual(added_user_2, response.data.get('members')[1])

    def test_remove_members_from_existing_groups(self):
        """
        Test case to check if an admin can remove members from the group

        Expected behaviour
        ----------------
        Members of the group should get removed from the group
        """
        token = G(MultiToken, user=F(name='user2'))
        member_emails = ['abc1@example.com', 'abc2@example.com']
        group_data = {
            'name': 'group1',
            'member_emails': member_emails
        }
        response = self.client.post(
            self.groups_url, group_data, **{'HTTP_AUTHORIZATION': f' Token {token.key}'}
        )
        self.assertEqual(2, len(response.data.get('members')))
        users_to_remove = {
            'member_emails': member_emails
        }
        response = self.client.patch(
            '{}{}/?operation=remove_members'.format(self.groups_url, response.data.get('id')),
            users_to_remove, **{'HTTP_AUTHORIZATION': f' Token {token.key}'}
        )
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(0, len(response.data.get('members')))

    def test_add_members_by_non_admin_user(self):
        """
        Test case to check if a non admin user can add members to the group or not

        Expected behaviour
        ----------------
        Users should not get added to the group if a non admin user tries to add them
        """
        token_1 = G(MultiToken, user=F(name='user1'))
        token_2 = G(MultiToken, user=F(name='user2'))
        group_data = {
            'name': 'group1',
            'member_emails': [token_2.user.email],
        }
        response = self.client.post(
            self.groups_url, group_data, **{'HTTP_AUTHORIZATION': f' Token {token_1.key}'}
        )
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(1, len(response.data.get('members')))
        users_to_add = {
            'member_emails': ['abc1@example.com', 'abc2@example.com']
        }
        forbidden_response = self.client.patch(
            '{}{}/?operation=add_members'.format(self.groups_url, response.data.get('id')),
            users_to_add, **{'HTTP_AUTHORIZATION': f' Token {token_2.key}'}
        )
        self.assertEqual(status.HTTP_403_FORBIDDEN, forbidden_response.status_code)
        self.assertEqual(1, len(response.data.get('members')))

    def test_remove_members_by_non_admin_user(self):
        """
        Test case to check if a non admin user can remove members from the group or not

        Expected behaviour
        ----------------
        Users should not be removed from the group if a non admin user tries to remove them
        """
        token_1 = G(MultiToken, user=F(name='user1'))
        token_2 = G(MultiToken, user=F(name='user2'))
        group_data = {
            'name': 'group1',
            'member_emails': [token_2.user.email],
        }
        response_1 = self.client.post(
            self.groups_url, group_data, **{'HTTP_AUTHORIZATION': f' Token {token_1.key}'}
        )
        self.assertEqual(status.HTTP_201_CREATED, response_1.status_code)
        self.assertEqual(1, len(response_1.data.get('members')))
        users_to_remove = {
            'member_emails': ['abc1@example.com', 'abc2@example.com']
        }
        response_2 = self.client.patch(
            '{}{}/?operation=add_members'.format(self.groups_url, response_1.data.get('id')),
            users_to_remove, **{'HTTP_AUTHORIZATION': f' Token {token_2.key}'}
        )
        self.assertEqual(status.HTTP_403_FORBIDDEN, response_2.status_code)
        self.assertEqual(1, len(response_1.data.get('members')))

    def test_get_group_by_user_not_part_of_group(self):
        """
        Test case to check if a user who is not a part of the group can access it or not

        Expected behaviour
        ----------------
        Should give an 404 not found response as the user doesn't exist in the group
        """
        token_1 = G(MultiToken, user=F(name='user1'))
        token_2 = G(MultiToken, user=F(name='user2'))
        group_data = {
            'name': 'group1',
        }
        response_1 = self.client.post(
            self.groups_url, group_data, **{'HTTP_AUTHORIZATION': f' Token {token_1.key}'}
        )
        self.assertEqual(status.HTTP_201_CREATED, response_1.status_code)
        self.assertEqual(group_data['name'], response_1.data.get('name'))
        response_2 = self.client.get(
            '{}{}/'.format(self.groups_url, response_1.data.get('id')), group_data,
            **{'HTTP_AUTHORIZATION': f' Token {token_2.key}'}
        )
        self.assertEqual(status.HTTP_404_NOT_FOUND, response_2.status_code)

    def test_update_existing_group_details(self):
        """
        Test case for testing if the admin can update an existing group or not

        Expected behaviour
        ----------------
        Group details should get updated
        """
        token = G(MultiToken, user=F(name='user1'))
        group_data = {
            'name': 'group1',
        }
        response = self.client.post(
            self.groups_url, group_data, **{'HTTP_AUTHORIZATION': f' Token {token.key}'}
        )
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(group_data['name'], response.data.get('name'))
        self.assertEqual(None, response.data.get('description'))
        group_data = {
            'name': 'updated_name',
            'description': 'updated_description',
        }
        response = self.client.patch(
            '{}{}/'.format(self.groups_url, response.data.get('id')),
            group_data, **{'HTTP_AUTHORIZATION': f' Token {token.key}'}
        )
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(group_data['name'], response.data.get('name'))
        self.assertEqual(group_data['description'], response.data.get('description'))
