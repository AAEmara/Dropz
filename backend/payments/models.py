from django.db import models


class Payment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("success", "Success"),
        ("failed", "Failed"),
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
    created_at = models.DateTimeField(auto_now_add=True)

    paymob_transaction_id = models.CharField(
        max_length=100, blank=True, null=True
    )
    paymob_order_id = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return (
            f"Payment {self.paymob_transaction_id or 'N/A'} "
            f"for Order {self.order.id}"
        )

    @property
    def amount(self):
        return self.amount_cents / 100
