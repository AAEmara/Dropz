from django.db import models
from django.conf import settings


class Order(models.Model):
    STATUS_CHOICE = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICE, default="pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    shipping_address = models.ForeignKey(
        "addresses.Address", null=True, blank=True, on_delete=models.SET_NULL
    )

    paymob_order_id = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Order #{self.id} by {self.user}"

    @property
    def total_cents(self):
        """Sum of all item costs in decimals"""
        return sum(item.total_price_cents for item in self.items.all())

    @property
    def total(self):
        """Return total as float"""
        return sum(self.total_price for item in self.items.all())


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, related_name="items", on_delete=models.CASCADE
    )
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE)
    quantity = models.PositiveSmallIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.title}"

    @property
    def total_price_cents(self):
        return (self.unit_price * 100) * self.quantity

    @property
    def total_price(self):
        return self.unit_price * self.quantity
