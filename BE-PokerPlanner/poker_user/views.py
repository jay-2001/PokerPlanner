from rest_framework import generics as rest_generics
from rest_framework import status as status
from rest_framework.generics import CreateAPIView, DestroyAPIView,UpdateAPIView
from rest_framework_multitoken.authentication import MultiTokenAuthentication
from rest_framework_multitoken.models import MultiToken
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from poker_user import (
    models as poker_user_models,
    serializers as poker_user_serializers,
)


class RegistrationView(CreateAPIView):
    """
        Description: API to handle post request for create new user with given details in database.
        request format:
        {
            "first_name": "jayjay",
            "last_name": "patell",
            "email" : "a5@gmail.com",
            "password": "1322",
            "address_line_1": "1",
            "address_line_2": "1",
            "zip_code":"392001"
        }
        success response format
            {
                status: 201,
                data: 'ACCOUNT IS CREATED SUCCESSFULLY'
            }
    """
    permission_classes = [AllowAny]
    serializer_class = poker_user_serializers.SignUpSerializer
    

class VerifyEmailView(UpdateAPIView):
    """
    Description: API to handle verification email ans it's ensure that
    user is click on verification link.

    request format:
        {
            token: <Token Object>
        }
    success response format
        {
            status: 200,
            data: 'ACCOUNT IS VERIFIED'
        }
    """
    permission_classes= [AllowAny]
    serializer_class = poker_user_serializers.VerificationSerializer
    queryset = MultiToken.objects.all()

    def get_queryset(self):
        return self.queryset.filter(key=self.request.data['token'])
 

class LoginView(CreateAPIView):
    """
    Description: API to handle user login.
    request format:
        {
            "email" : "abc@gmail.com",
            "password" : "13232312"
        }

    success response format
        {
            status: 200,
            token: 'user's token'
        }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = poker_user_serializers.LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            status=status.HTTP_200_OK, data=serializer.validated_data
        )


class LogoutView(DestroyAPIView):
    """
    Description: API to handle user login.
    request format of header:
        {
            Authorization: Token <user Token>
        }

    success response format
        {
            status: 204
        }
    """
    authentication_classes = [MultiTokenAuthentication]
    serializer_class = poker_user_serializers.LogoutSerializer
    queryset = MultiToken.objects.all()


class UpdateLoggedInUserProfileApiView(rest_generics.UpdateAPIView):
    """
    To update user details of a user with given id
    request:
    {
        "first_name":"Rashmija",
        "last_name":"Pandey"
    }
    response:
    {
       "id": 1,
       "first_name": "Rashmija",
       "last_name": "Pandey",
       "email": "rash@gmail.com",
       "phone_number": null,
       "address_line_1": "addn1",
       "address_line_2": "add 2",
       "zip_code": "984343",
       "state": "UP",
       "city": "dev",
       "gender": 1,
       "date_of_birth": "2023-02-21"
    }
    """
    queryset = poker_user_models.PokerUser.objects.all()
    serializer_class = poker_user_serializers.LoggedInUserProfileSerializer

    def get_queryset(self):
        return self.queryset.filter(id=self.request.user.id)


class LoggedInUserProfileApiView(rest_generics.RetrieveAPIView):
    """
    To get the profile details of the logged in user
    request: GET request
    response:
        {
            "id": 1,
            "first_name": "",
            "last_name": "Pandey",
            "email": "rash@gmail.com",
            "phone_number": null,
            "address_line_1": "addn1",
            "address_line_2": "add 2",
            "zip_code": "984343",
            "state": "UP",
            "city": "dev",
            "gender": 1,
            "date_of_birth": "2023-02-21"
        }
    """
    serializer_class = poker_user_serializers.LoggedInUserProfileSerializer
    queryset = poker_user_models.PokerUser.objects.all()

    def get_object(self):
        return self.queryset.get(id=self.request.user.id)
