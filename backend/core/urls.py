from django.contrib import admin
from django.urls import path, re_path
from crypto_api import views

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    #authentication endpoints
    path('api/token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', views.RegisterView.as_view(), name='auth_register'),
    path('api/user/', views.user_details, name="get_user_details"),
    path('', views.getRoutes),

    #operational endpoints
    path('api/crypto/portfolio/', views.portfolio_list, name="portfolio_list"),
    path('api/crypto/portfolio/<portfolio_id>', views.portfolio_detail, name='portfolio_detail'),
    path('api/crypto/assets/<portfolio_id>', views.asset_list, name='asset_list'),
    path('api/crypto/assets/<asset_id>', views.asset_detail, name='asset_detail'),
    path('api/crypto/transaction/<portfolio_linked>', views.transaction_list, name='transaction_list'),
    path('api/crypto/transaction/<coin>', views.transaction_list_byAsset, name='transaction_list_by_asset'),
    path('api/crypto/transaction/<transaction_id>', views.transaction_detail, name='transaction_detail'),

    #log data endpoints
    path('api/crypto/log_data/<portfolio_linked>', views.get_log_data)
]