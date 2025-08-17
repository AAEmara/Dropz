from django.urls import path
from .views import WishlistView, WishlistAddView, WishlistRemoveView


urlpatterns = [
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('wishlist/add/', WishlistAddView.as_view(), name='wishlist-add'),
    path(
        'wishlist/remove/<int:product_id>/', 
        WishlistRemoveView.as_view(), 
        name='wishlist-remove'
    ),
]
