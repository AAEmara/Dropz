from django.contrib import admin
from django.urls import path, include
from .views import hello_world
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("admin/", admin.site.urls),
    path("hello/", hello_world),
    path("api/", include("accounts.urls")),
    path("api/", include("addresses.urls")),
    path("api/", include("products.urls")),
    path("api/", include("carts.urls")),
    path("api/", include("wishlists.urls")),
    path("api/support/", include("support.urls")),
    path("payments/", include("payments.urls")),
    path("api/", include("orders.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
