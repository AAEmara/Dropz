from django.db import models
from products.models import Product
from accounts.models import CustomerProfile


class Wishlist(models.Model):
    customer = models.OneToOneField(
        CustomerProfile,
        on_delete=models.CASCADE,
        related_name="wishlist"
    )

    def __str__(self):
        return f"{self.customer.user.email}'s Wishlist"


class WishlistItem(models.Model):
    wishlist = models.ForeignKey(
        Wishlist,
        on_delete=models.CASCADE,
        related_name="items"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="wishlist_items"
    )
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("wishlist", "product")

    def __str__(self):
        return f"{self.product} in {self.wishlist}"
