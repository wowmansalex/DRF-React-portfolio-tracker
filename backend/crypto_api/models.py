from django.db import models
from django.db.models import Avg, Q

from django.utils.translation import gettext_lazy as _

from django.contrib.auth.models import User, AbstractUser
from django.db.models.signals import post_save, pre_save, post_delete

from django.dispatch import receiver
import requests

from .users import CustomUser as CustomUserModel

class CustomUser(AbstractUser):
  username = None
  user_id = models.AutoField(primary_key=True)
  email = models.EmailField(_('email address'), unique=True)

  USERNAME_FIELD = "email"
  REQUIRED_FIELDS = []

  objects = CustomUserModel()

  def __str__(self):
    return self.email


class Portfolio(models.Model):
  id = models.AutoField(primary_key=True)
  user = models.ForeignKey(CustomUser, default=None, on_delete=models.CASCADE)
  name = models.CharField(max_length=200)
  balance = models.FloatField(default=0)
  date_added = models.DateTimeField(auto_now_add=True)
  updated = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.name

class Asset(models.Model):
  id = models.AutoField(primary_key=True)
  portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
  name = models.CharField(max_length=200)
  current_price = models.FloatField(default=0)
  average_price = models.FloatField(default=0)
  value = models.FloatField(default=0)
  amount = models.FloatField(default=0)

  def __str__(self):
    return self.name

class Transaction(models.Model):
  id = models.AutoField(primary_key=True)
  portfolio_linked = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
  coin = models.ForeignKey(Asset, on_delete=models.CASCADE)
  transaction_type = models.CharField(max_length=200)
  amount = models.FloatField()
  price = models.FloatField(default=0)
  date_added = models.DateTimeField()
  updated = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.transaction_type

class Log_Data(models.Model):
  id = models.AutoField(primary_key=True)
  description = models.TextField()
  portfolio_linked = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
  data_logged = models.CharField(max_length=255)
  current_balance = models.FloatField()
  updated = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.description

@receiver(pre_save, sender=Transaction)
def transaction_created(instance, *args, **kwargs):
  if instance.transaction_type == 'buy':
    if Asset.objects.filter(Q(name=instance.coin) and Q(portfolio=instance.portfolio_linked)).exists():
      portfolio = Portfolio.objects.get(name=instance.portfolio_linked)
      asset = Asset.objects.get(name=instance.coin)

      value = getattr(Asset.objects.get(name=instance.coin), 'value')
      amount = getattr(Asset.objects.get(name=instance.coin), 'amount')
      
      response = requests.get('https://api.coingecko.com/api/v3/simple/price', params={'ids':instance.coin, 'vs_currencies':'usd'}).json()
      price = response[str(instance.coin).lower()]['usd']
      
      instance.price = price
      asset.amount = amount + instance.amount
      asset.save()
      
      # Log_Data.objects.create(description='transaction-buy', data_logged='transaction', current_balance=portfolio.balance)
    else: 
      Asset.objects.create(name=instance.coin, amount=instance.amount, portfolio_id='3', value=(instance.price*instance.amount))
      asset = Asset.objects.get(name=instance.coin)
     
      value = getattr(Asset.objects.get(name=instance.coin), 'value')
      
      response = requests.get('https://api.coingecko.com/api/v3/simple/price', params={'ids':instance.coin, 'vs_currencies':'usd'}).json()
      price = response[str(instance.coin).lower()]['usd']
      instance.price = price
      asset.current_price = price
      asset.amount = instance.amount
      asset.save()

      Log_Data.objects.create(description='transaction-buy-created', data_logged='transaction', current_balance=portfolio.balance)

  elif instance.transaction_type == 'sell':
    if Asset.objects.filter(name=instance.coin).exists():
      value = getattr(Asset.objects.get(name=instance.coin), 'value')
      amount = getattr(Asset.objects.get(name=instance.coin), 'amount')
      asset = Asset.objects.get(name=instance.coin)
      
      response = requests.get('https://api.coingecko.com/api/v3/simple/price', params={'ids':instance.coin, 'vs_currencies':'usd'}).json()
      price = response[str(instance.coin).lower()]['usd']
      instance.price = price
      asset.amount = amount - instance.amount
      asset.save()
      
      Log_Data.objects.create(description='transaction-sell', data_logged='transaction', current_balance=portfolio.balance)
    else: 
      print('Asset not found')

@receiver(post_save, sender=Transaction)
def calculateAveragePrice(instance, *args, **kwargs):
  asset = Asset.objects.get(name=instance.coin)
  transactions = Transaction.objects.all()

  for transaction in transactions:
    average_price = Transaction.objects.filter(coin=instance.coin).aggregate(Avg('price'))
    asset.average_price = average_price['price__avg']
    asset.save()
