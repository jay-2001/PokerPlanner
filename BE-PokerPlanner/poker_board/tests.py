from ddf import F, G
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_multitoken.models import MultiToken

from poker_group.serializers import PokerGroup, PokerGroupSerializer
from poker_user.serializers import MemberSerializer, PokerUser


class BoardAPITestCases(APITestCase):
    '''
    This is a test case class for board API.
    It tests the behavior of creating, deleting and adding/removing members/groups to a board.

    Here are the details of the tests:
        `test_create_board_without_token`:
            checks if a board can be created without authentication credentials.
            Expected behavior is that the board should not be created.
        `test_create_board_with_token`:
            checks if a board can be created by an authenticated user.
            Expected behavior is that the board should be created.
        `test_create_board_without_required_fields`:
            checks if a board can be created without required fields.
            Expected behavior is that the board should not be created.
        `test_delete_board_by_manager`:
            checks if a board can be deleted by manager.
            Expected behavior is that the board should be deleted.
        `test_get_board_by_non_member_user`:
            checks if a user who is not a part of board can fetch it or not.
            Expected behavior is that the board should not be fetched.
        `test_add_remove_members_to_board_by_manager`:
            checks if manager can add/remove members from the board or not.
            Expected behavior is that the manager can perform these actions.
        `test_remove_manager_from_board`:
            checks if a manager can be removed from board or not.
            Expected behavior is that the manager should not get removed.
        `test_remove_non_existent_user_from_board`:
            checks if a non existent user can be removed from the board or not
            Expected behaviour is that there will be not effect on board
        `test_add_remove_group_to_board`:
            checks if manager can add/remove groups from the board or not
            Expected behaviour is that manager can perform this action
        `test_add_members_by_non_manager_user`:
            checks if a non manager user can add members to the board or not
            Expected behaviour is that the non manager user cannot add members to board
    '''
    boards_url = reverse('boardapi-list')
    board_data = {
        'name': 'board1',
        'description': 'new_description',
        'voting_system': 0,
        'estimation_choices': [1, 2, 3, 5, 8, 13]
    }

    def test_create_board_without_token(self):
        """
        Test case to check if a board can be created without giving token in headers

        Expected behaviour
        -------------------
        Board should not get created
        """
        response = self.client.post(self.boards_url, self.board_data)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_create_board_with_token(self):
        """
        Test case to check if a board can be created by an authenticated user

        Expected behaviour
        -------------------
        Board should get created
        """
        token = G(MultiToken, user=F(email='abc@example.com'))
        response = self.client.post(
            self.boards_url, self.board_data, **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(self.board_data['name'], response.data.get('name'))
        self.assertEqual(self.board_data['description'], response.data.get('description'))
        self.assertEqual('Fibonacci', response.data.get('voting_system_name'))
        self.assertEqual(
            self.board_data['estimation_choices'], response.data.get('estimation_choices')
        )
        self.assertEqual(token.user.email, response.data.get('manager').get('email'))
        self.assertEqual([], response.data.get('poker_ticket'))
        self.assertEqual(0, response.data.get('estimated_tickets_cnt'))
        self.assertEqual(1, len(response.data.get('users')))

    def test_create_board_without_required_fields(self):
        """
        Test case to check whether a board can be created without providing required fields
        Required fields are --> name, voting_system, estimation_choices

        Expected behaviour
        ---------------------
        Board should not get created if any of the above fields are missing in request
        """
        token = G(MultiToken, user=F(email='abc@example.com'))
        board_data = {
            'description': 'new_description',
            'voting_system': 0,
            'estimation_choices': [1, 2, 3, 5, 8, 13]
        }
        response = self.client.post(
            self.boards_url, board_data, **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        board_data = {
            'name': 'board1',
            'description': 'new_description',
            'estimation_choices': [1, 2, 3, 5, 8, 13]
        }
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        board_data = {
            'name': 'board1',
            'description': 'new_description',
            'voting_system': 0,
        }
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
    
    def test_delete_board_by_manager(self):
        """
        Test case to check if a manager can delete the board or not

        Expected behaviour
        ---------------------
        Board should get deleted
        """
        token = G(MultiToken, user=F(email='abc@example.com'))
        response = self.client.post(
            self.boards_url, self.board_data, **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        response = self.client.delete(
            '{}{}/'.format(self.boards_url, response.data.get('id')),
            **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
    
    def test_get_board_by_non_member_user(self):
        """
        Test case to check if a user who is not a part of board can access the board or not

        Expected behaviour
        ---------------------
        Board should not get fetched and raises 404 error for the user
        """
        token_1 = G(MultiToken, user=F(email='abc1@example.com'))
        token_2 = G(MultiToken, user=F(email='abc2@example.com'))
        response = self.client.post(
            self.boards_url, self.board_data, **{'HTTP_AUTHORIZATION': f'Token {token_1}'}
        )
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        response = self.client.delete(
            '{}{}/'.format(self.boards_url, response.data.get('id')),
            **{'HTTP_AUTHORIZATION': f'Token {token_2}'}
        )
        self.assertEqual(status.HTTP_404_NOT_FOUND, response.status_code)
    
    def test_add_remove_members_to_board_by_manager(self):
        """
        Test case to check if a manager can add and remove members to the board or not

        Expected behaviour
        ---------------------
        Users should get added and removed from the board
        """
        token = G(MultiToken, user=F(email='abc@example.com'))
        user_1, user_2 = G(PokerUser), G(PokerUser)
        response = self.client.post(
            self.boards_url, self.board_data, **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(1, len(response.data.get('users')))
        users_to_add_remove = {
            'user_emails': [user_1.email, user_2.email]
        }
        response = self.client.patch(
            '{}{}/?operation=add_members'.format(self.boards_url, response.data.get('id')),
            users_to_add_remove, **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(3, len(response.data.get('users')))
        self.assertEqual(MemberSerializer(user_1).data, response.data.get('users')[1])
        self.assertEqual(MemberSerializer(user_2).data, response.data.get('users')[2])
        response = self.client.patch(
            '{}{}/?operation=remove_members'.format(self.boards_url, response.data.get('id')),
            users_to_add_remove, **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(1, len(response.data.get('users')))
        self.assertEqual(MemberSerializer(token.user).data, response.data.get('users')[0])
    
    def test_remove_manager_from_board(self):
        """
        Test case to check if a manager can be removed from the board or not

        Expected behaviour
        ---------------------
        Manager will not be removed from the board
        """
        token = G(MultiToken, user=F(email='abc@example.com'))
        response = self.client.post(
            self.boards_url, self.board_data, **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(1, len(response.data.get('users')))
        self.assertEqual(MemberSerializer(token.user).data, response.data.get('users')[0])
        users_to_remove = {
            'user_emails': [token.user.email]
        }
        response = self.client.patch(
            '{}{}/?operation=remove_members'.format(self.boards_url, response.data.get('id')),
            users_to_remove, **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(1, len(response.data.get('users')))
        self.assertEqual(MemberSerializer(token.user).data, response.data.get('users')[0])
    
    def test_remove_non_existent_user_from_board(self):
        """
        Test case to check if a non existent user can be removed from the board or not

        Expected behaviour
        ---------------------
        It should have not have any effect on the board
        """
        token = G(MultiToken, user=F(email='abc@example.com'))
        response = self.client.post(
            self.boards_url, self.board_data, **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(1, len(response.data.get('users')))
        self.assertEqual(MemberSerializer(token.user).data, response.data.get('users')[0])
        users_to_remove = {
            'user_emails': ['random@example.com']
        }
        response = self.client.patch(
            '{}{}/?operation=remove_members'.format(self.boards_url, response.data.get('id')),
            users_to_remove, **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(1, len(response.data.get('users')))
        self.assertEqual(MemberSerializer(token.user).data, response.data.get('users')[0])
    
    def test_add_remove_group_to_board(self):
        """
        Test case to check if a manager can add and remove groups from the board or not

        Expected behaviour
        ---------------------
        Groups should get added and removed from the board
        """
        group_1 = G(PokerGroup, members=[F(email='abc1@example.com'), F(email='abc2@example.com')])
        group_2 = G(PokerGroup, members=[F(email='abc3@example.com'), F(email='abc4@example.com')])
        token = G(MultiToken, user=F(email='abc@example.com'))
        response = self.client.post(
            self.boards_url, self.board_data, **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(1, len(response.data.get('users')))
        self.assertEqual(MemberSerializer(token.user).data, response.data.get('users')[0])
        groups_to_add = {
            'group_names': [group_1.name, group_2.name]
        }
        response = self.client.patch(
            '{}{}/?operation=add_groups'.format(self.boards_url, response.data.get('id')),
            groups_to_add, **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(5, len(response.data.get('users')))
        self.assertEqual(2, len(response.data.get('groups')))
        self.assertEqual(PokerGroupSerializer(group_1).data, response.data.get('groups')[0])
        self.assertEqual(PokerGroupSerializer(group_2).data, response.data.get('groups')[1])
        groups_to_remove = {
            'group_names': [group_1.name]
        }
        response = self.client.patch(
            '{}{}/?operation=remove_groups'.format(self.boards_url, response.data.get('id')),
            groups_to_remove, **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(3, len(response.data.get('users')))
        self.assertEqual(1, len(response.data.get('groups')))
        groups_to_remove = {
            'group_names': [group_2.name]
        }
        response = self.client.patch(
            '{}{}/?operation=remove_groups'.format(self.boards_url, response.data.get('id')),
            groups_to_remove, **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(1, len(response.data.get('users')))
        self.assertEqual(0, len(response.data.get('groups')))
        response = self.client.patch(
            '{}{}/?operation=remove_groups'.format(self.boards_url, response.data.get('id')),
            groups_to_remove, **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(1, len(response.data.get('users')))
        self.assertEqual(0, len(response.data.get('groups')))
    
    def test_add_members_by_non_manager_user(self):
        """
        Test case to check if a non manager user can add members to the board or not

        Expected behaviour
        ---------------------
        Non manager user cannot add users to the board and get 403 error
        """
        user_1, user_2 = G(PokerUser), G(PokerUser)
        token = G(MultiToken, user=user_1)
        response = self.client.post(
            self.boards_url, self.board_data, **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(1, len(response.data.get('users')))
        self.assertEqual(MemberSerializer(user_1).data, response.data.get('users')[0])
        users_to_add = {
            'user_emails': [user_2.email]
        }
        response = self.client.patch(
            '{}{}/?operation=add_members'.format(self.boards_url, response.data.get('id')),
            users_to_add, **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(2, len(response.data.get('users')))
        self.assertEqual(MemberSerializer(user_2).data, response.data.get('users')[1])
        token_2 = G(MultiToken, user=user_2)
        response_2 = self.client.patch(
            '{}{}/?operation=add_members'.format(self.boards_url, response.data.get('id')),
            users_to_add, **{'HTTP_AUTHORIZATION': f'Token {token_2}'}
        )
        self.assertEqual(status.HTTP_403_FORBIDDEN, response_2.status_code)
