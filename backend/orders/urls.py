from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CheckoutView, OrderViewSet

router = DefaultRouter()
router.register("orders", OrderViewSet, basename="orders")

urlpatterns = [
    path("", include(router.urls)),
    path("checkout/", CheckoutView.as_view(), name="checkout"),
]
