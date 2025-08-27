from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet,
    CategoryViewSet,
    ProductReviewListCreateView,
    ProductReviewDetailView,
    SellerProductViewSet,
)

router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="product")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(
    r'seller/products',
    SellerProductViewSet,
    basename='seller-products',
)

urlpatterns = [
    path("", include(router.urls)),
    path(
        "products/<slug:product_slug>/reviews",
        ProductReviewListCreateView.as_view(),
        name="product-review-list-create",
    ),
    path(
        "reviews/<int:pk>",
        ProductReviewDetailView.as_view(),
        name="product-review-detail",
    ),
]
