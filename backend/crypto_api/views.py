from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.renderers import JSONRenderer
import requests

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import CustomUser, Portfolio, Asset, Transaction, Log_Data
from .serializers import *

from datetime import timedelta
import time

#authentication views
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

@api_view(['GET'])
def getRoutes(request):
    routes = [
        'api/token/',
        'api/login/',
        'api/register/',
        'api/token/refresh/'
    ]
    return Response(routes)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_details(request):
  if request.method == 'GET':
    data = request.user.user_id
    
    return Response({'response': data}, status=status.HTTP_200_OK)
  return Response(null, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
# get all portfolios linked to the user requesting 
# post new portfolio created by authenticated user
def portfolio_list(request):
  if request.method == 'GET':
    print(request.user.email)
    data = Portfolio.objects.get(user=request.user.email)

    serializer = PortfolioSerializer(data, context={'request': request}, many=True)
    return Response(serializer.data)

  elif request.method == 'POST':
    print(request.data)
    serializer = PortfolioSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
# get all assets linked to portfolio of requested user
# add a new asset to the selected portfolio
def asset_list(request):
  if request.method == 'GET':
    data = Asset.objects.filter(portfolio_id=request.query_params.get('portfolio_linked'))

    for item in data: 
      response_symbol_image = requests.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1').json()

      coin_data = response_symbol_image

      for coin in coin_data:
        if item.name == coin['name']:       
          item.symbol = coin['id']
          item.image = coin['image']

      response_current_price = requests.get('https://api.coingecko.com/api/v3/simple/price', params={'ids':item.symbol, 'vs_currencies':'usd'}).json()
      response_price_24H = requests.get(f'https://api.coingecko.com/api/v3/coins/{item.symbol}/market_chart?vs_currency=usd&days=1').json()

      yesterday = time.time()*1000 - 24*60*60*1000
      
      prices_response = response_price_24H['prices']

      for price in prices_response:
        if  price[0] - yesterday <= 60000:
          item.price_24h = price[1]

      item.current_price = response_current_price[str(item.symbol).lower()]['usd']
      item.value = item.current_price * item.amount

      item.save()

    serializer = AssetSerializer(data, context={'request': request}, many=True)

    return Response(serializer.data)

  elif request.method == 'POST':
    serializer = AssetSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
# get all transaction linked to a portfolio
# create a new transaction
def transaction_list(request):
  if request.method == 'GET':
    data = Transaction.objects.filter(portfolio_linked=request.query_params.get('portfolio_linked'))

    serializer = TransactionSerializer(data, context={'request': request}, many=True)
    return Response(serializer.data)
    
  elif request.method == 'POST':
    serializer = TransactionSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
# get transaction by asset name for transaction mapping
def transaction_list_byAsset(request, coin):
  if request.method == 'GET':
    data = Transaction.objects.filter(coin=coin)

    serializer = TransactionSerializer(data, context={'request': request}, many=True)

    return Response(serializer.data)

@api_view(['GET', 'POST']) 
@permission_classes([IsAuthenticated])
# get all log data linked to requested portfolio
def get_log_data(request):
  if request.method == 'GET':
    data = Log_Data.objects.filter(portfolio_linked=request.query_params.get('portfolio_linked'))
    
    serializer = LogDataSerializer(data, context={'request':request}, many=True)
    return Response(serializer.data)

  elif request.method == 'POST':
    serializer = LogDataSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
# get a specific portfolio linked to requested user
def portfolio_detail(request):
  try:
    print(request.user.email)
    data = Portfolio.objects.get(user=request.user.user_id)
  except Portfolio.DoesNotExist:
    return Response(status=status.HTTP_404_NOT_FOUND)
  
  if request.method == 'GET':
    
    assets = Asset.objects.filter(portfolio=data)

    total_asset_value = 0

    for asset in assets:
      total_asset_value += asset.value

    data.balance = total_asset_value

    Log_Data.objects.create(portfolio_linked=data, description='balance-update', data_logged='portfolio-balance', current_balance=data.balance)

    data.save()

    serializer = PortfolioSerializer(data, context={'request': request}, many=False)
    return Response(serializer.data)

  elif request.method == 'PUT':
    serializer = PortfolioSerializer(data, data=request.data, context={'request': request})
    if serializer.is_valid():
      serializer.save()
      return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
  elif request.method == 'DELETE':
    portfolio.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
#get specific asset linked to requested user portfolio
def asset_detail(request, id):
  try:
    asset = Asset.objects.get(id=id)

  except Asset.DoesNotExist:
    return Response(status=status.HTTP_404_NOT_FOUND)
  
  if request.method == 'GET':
    serializer = AssetSerializer(asset, context={'request': request}, many=True)
    return Response(serializer.asset)

  if request.method == 'PUT':
    serializer = AssetSerializer(asset, data=request.data, context={'request': request})
    if serializer.is_valid():
      serializer.save()
      return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
  elif request.method == 'DELETE':
    asset.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
#get asset current price 
def asset_current_price(request, id):
  try:
    asset = Asset.objects.get(id=id)
    response = requests.get('https://api.coingecko.com/api/v3/simple/price', params={'ids':asset.name, 'vs_currencies':'usd'}).json()
  except Asset.DoesNotExist:
    return Response(status=status.HTTP_404_NOT_FOUND)
  
  if request.method == 'GET':
    return Response(response, status=status.HTTP_200_OK)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
# get or update specific transaction
def transaction_detail(request):
  try:
    transaction = Transaction.objects.get(id=request.query_params.get('transaction_id'), portfolio_linked=request.query_params.get('portfolio_linked'))
  except:
    return Response('Transaction not found', status=status.HTTP_404_NOT_FOUND)

  if request.method == 'PUT':
    serializer = AssetSerializer(transaction, data=request.data, context={'request': request})
    if serializer.is_valid():
      serializer.save()
      return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
  elif request.method == 'DELETE':
    transaction.delete()  
    return Response(status=status.HTTP_204_NO_CONTENT)
