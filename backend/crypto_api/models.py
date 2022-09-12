from django.db import models
from django.db.models import Avg, Q

from django.utils.translation import gettext_lazy as _

from django.contrib.auth.models import User, AbstractUser
from django.db.models.signals import post_save, pre_save, post_delete, pre_delete

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
  coin = models.CharField(max_length=255)
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
  portfolio_linked = models.CharField(max_length=255)
  data_logged = models.CharField(max_length=255)
  current_balance = models.FloatField()
  updated = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.description

@receiver(pre_save, sender=Transaction)
def transaction_created(instance, *args, **kwargs):
  if instance.transaction_type == 'buy':
    
    if Asset.objects.filter(name=instance.coin, portfolio=instance.portfolio_linked).exists():
      portfolio = Portfolio.objects.get(name=instance.portfolio_linked)
      asset = Asset.objects.get(name=instance.coin)

      value = getattr(Asset.objects.get(name=instance.coin), 'value')
      amount = getattr(Asset.objects.get(name=instance.coin), 'amount')
      
      asset.value = value + (instance.price * instance.amount)
      asset.amount = amount + instance.amount
      asset.save()
      
      Log_Data.objects.create(portfolio_linked=instance.portfolio_linked, description='transaction-buy', data_logged='transaction', current_balance=portfolio.balance)
    else: 
      portfolio = Portfolio.objects.get(name=instance.portfolio_linked)
      Asset.objects.create(name=instance.coin, amount=instance.amount, portfolio=portfolio, value=(instance.price*instance.amount))
      asset = Asset.objects.get(name=instance.coin)
     
      value = getattr(Asset.objects.get(name=instance.coin), 'value')
      
      response = requests.get('https://api.coingecko.com/api/v3/simple/price', params={'ids':instance.coin, 'vs_currencies':'usd'}).json()
      price = response[str(instance.coin).lower()]['usd']
      instance.price = price
      asset.current_price = price
      asset.amount = instance.amount
      asset.save()


  elif instance.transaction_type == 'sell':
    if Asset.objects.filter(name=instance.coin).exists():
      value = getattr(Asset.objects.get(name=instance.coin), 'value')
      amount = getattr(Asset.objects.get(name=instance.coin), 'amount')
      asset = Asset.objects.get(name=instance.coin)

      asset.price = instance.price
      asset.amount = amount - instance.amount
      asset.save()

      if asset.amount <= 0:
        asset.delete()
      
    else: 
      print('Asset not found')

@receiver(post_save, sender=Transaction)
def calculateAveragePrice(instance, *args, **kwargs):
  asset = Asset.objects.get(name=instance.coin)
  transactions = Transaction.objects.filter(portfolio_linked=instance.portfolio_linked)

  for transaction in transactions:
    average_price = Transaction.objects.filter(coin=instance.coin).aggregate(Avg('price'))
    asset.average_price = average_price['price__avg']
    asset.save()

@receiver(pre_delete, sender=Transaction)
def transaction_deleted(instance, *args, **kwargs):
  asset = Asset.objects.get(name=instance.coin)
  transactions = Transaction.objects.filter(coin=instance.coin).count()
  print(transactions)

  if transactions == 1:
    asset.delete()  