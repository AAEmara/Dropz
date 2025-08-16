from django.urls import path
from .views import (
    CartItemListView,
    AddCartItemView,
    IncreaseCartItemQuantityView,
    DecreaseCartItemQuantityView,
    CartItemDetailView,
    UpdateCartItemQuantityView,
    DeleteCartItemView
)

urlpatterns = [
    path(
        "cart/items",
        CartItemListView.as_view(),
        name="cart-items",
    ),
    path(
        "cart/items/<int:pk>",
        CartItemDetailView.as_view(),
        name="cart-detail",
    ),
    path(
        "cart/additem",
        AddCartItemView.as_view(),
        name="cart-item-add",
    ),
    path(
        "cart/increase/<int:pk>",
        IncreaseCartItemQuantityView.as_view(),
        name="cart-item-increase",
    ),
    path(
        "cart/decrease/<int:pk>",
        DecreaseCartItemQuantityView.as_view(),
        name="cart-item-decrease",
    ),
    path(
        "cart/update/<int:pk>",
        UpdateCartItemQuantityView.as_view(),
        name="cart-item-update",
    ),
    path(
        "cart/delete/<int:pk>",
        DeleteCartItemView.as_view(),
        name="cart-delete",
        )
]
