from django.contrib import admin
from django.urls import path, include
from .views import hello_world
from django.urls import path, include  


urlpatterns = [
    path('admin/', admin.site.urls),
    path('hello/', hello_world),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('addresses.urls')),
]
