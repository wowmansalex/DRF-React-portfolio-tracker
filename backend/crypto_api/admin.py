from django.contrib import admin
from crypto_api.models import CustomUser, Portfolio, Asset, Transaction, Log_Data

class UserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'email')

class PortfolioAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'name', 'balance', 'updated']

class AssetAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'portfolio'] 

class TransactionAdmin(admin.ModelAdmin):
    list_display = ['id', 'portfolio_linked', 'coin', 'transaction_type', 'price']

class Log_DataAdmin(admin.ModelAdmin):
    list_display = ['data_logged', 'updated', 'current_balance']   

admin.site.register(CustomUser, UserAdmin)

admin.site.register(Portfolio, PortfolioAdmin)
admin.site.register(Asset, AssetAdmin)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(Log_Data, Log_DataAdmin)