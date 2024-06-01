from django.contrib.auth import get_user_model

from rest_framework_simplejwt import authentication as jwt_authentication
from django.conf import settings
from rest_framework import authentication, exceptions as rest_exceptions


User = get_user_model()

secret_key = settings.SECRET_KEY

import jwt, datetime
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings
from rest_framework import exceptions 
from rest_framework.authentication import BaseAuthentication, get_authorization_header

User = get_user_model()

secret_key = settings.SECRET_KEY

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth = get_authorization_header(request).split()

        if auth and len(auth) == 2:
            token = auth[1].decode('utf-8')
            id = decode_access_token(token)
            
            user = User.objects.get(pk=id)
            return (user, None)
        raise exceptions.AuthenticationFailed('Unauthenticated')

def create_access_token(id):
    return jwt.encode({
        'user_id': id,
        'exp': timezone.now() + datetime.timedelta(seconds=60),
        'iat': timezone.now()
    }, 'access_secret', algorithm='HS256')


def decode_access_token(token):
    try:
        payload = jwt.decode(token, 'access_secret', algorithms=['HS256'])
        return payload['user_id']
    except:
        raise exceptions.AuthenticationFailed('Unauthenticated')


def create_refresh_token(id):
    return jwt.encode({
        'user_id': id,
        'exp': timezone.now() + datetime.timedelta(days=10),
        'iat': timezone.now()
    }, 'refresh_secret', algorithm='HS256')


def decode_refresh_token(token):
    try:
        payload = jwt.decode(token, 'refresh_secret', algorithms=['HS256'])
        return payload['user_id']
    except:
        raise exceptions.AuthenticationFailed('Unauthenticated')


