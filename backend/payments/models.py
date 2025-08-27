# payments/models.py
from django.db import models


class Payment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("success", "Success"),
        ("failed", "Failed"),
    ]
    METHOD_CHOICES = [
        ("paymob", "Paymob"),
        ("cash", "Cash on Delivery"),
        ("card", "Credit Card"),
    ]
    order = models.ForeignKey(
        "orders.Order",
        related_name="payments",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    amount_cents = models.PositiveIntegerField()
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="pending"
    )
    method = models.CharField(
        max_length=20, choices=METHOD_CHOICES, default="paymob"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paymob_transaction_id = models.TextField(blank=True, null=True)
    paymob_order_id = models.TextField(blank=True, null=True)
    paymob_payment_key = models.TextField(blank=True, null=True)
    response_payload = models.JSONField(blank=True, null=True)

    def __str__(self):
        return (
            f"Payment {self.paymob_transaction_id or 'N/A'} "
            f"for Order {self.order.id if self.order else 'N/A'}"
        )

    @property
    def amount(self):
        return self.amount_cents / 100
