from django.contrib import admin
from django.urls import path, include
from .views import hello_world


urlpatterns = [
    path("admin/", admin.site.urls),
    path("hello/", hello_world),
    path("api/", include("accounts.urls")),
    path("api/", include("addresses.urls")),
    path("api/", include("products.urls")),
    path("api/", include("carts.urls")),
    path("api/", include("wishlists.urls")),
]
