from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate

from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.http import JsonResponse

from .models import CustomUser, Asset, Transaction, Portfolio, Log_Data

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
  @classmethod
  def get_token(cls, user):
    token = super().get_token(user)
    token['email'] = user.email
    return token

class RegisterSerializer(serializers.ModelSerializer):
  password = serializers.CharField(
    write_only=True, required=True, validators=[validate_password])
  password2 = serializers.CharField(write_only=True, required=True)

  class Meta:
    model = CustomUser
    fields = ('email', 'password', 'password2')

  def validate(self, attrs):
    if attrs['password'] != attrs['password2']:
      raise serializers.ValidationError(
        {'password': 'Password field did not match'}
      )
    return attrs

  def create(self, validated_data):
    user = CustomUser.objects.create(email=validated_data['email'])
    user.set_password(validated_data['password'])
    user.save()
    return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('user_id', 'email', 'username')

class PortfolioSerializer(serializers.ModelSerializer):
  class Meta:
    model = Portfolio
    fields = ('name', 'id', 'balance')

class AssetSerializer(serializers.ModelSerializer):
  class Meta:
    model = Asset
    fields = ('portfolio', 'id', 'name', 'current_price', 'price_24h' , 'average_price', 'value', 'amount')

class TransactionSerializer(serializers.ModelSerializer):
  class Meta:
    model = Transaction
    fields = ('coin', 'portfolio_linked','id', 'transaction_type', 'amount', 'price', 'date_added')    
  
class LogDataSerializer(serializers.ModelSerializer):
  class Meta:
    model = Log_Data
    fields = ('portfolio_linked', 'updated', 'description', 'current_balance')