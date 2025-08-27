from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CheckoutView, OrderViewSet

router = DefaultRouter()
router.register("orders", OrderViewSet, basename="orders")

urlpatterns = [
    path("orders/checkout/", CheckoutView.as_view(), name="orders-checkout"),
    path("", include(router.urls)),
]
