# accounts/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path("auth/register/", views.RegisterView.as_view(), name="register"),
    path("auth/logout/", views.LogoutView.as_view()),
    path("auth/login/", views.MyTokenObtainPairView.as_view()),
    path("auth/refresh_token/", TokenRefreshView.as_view()),
    path(
        "accounts/sellers/me", views.SellerMeView.as_view(), name="seller-me"
    ),
]
