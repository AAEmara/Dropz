# accounts/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, 
    MyTokenObtainPairView, 
    LogoutView
)

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('login/', MyTokenObtainPairView.as_view()),
    path('refresh_token/', TokenRefreshView.as_view()),  
]
