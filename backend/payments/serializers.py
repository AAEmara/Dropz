from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    amount = serializers.FloatField(read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id",
            "order",
            "amount_cents",
            "amount",
            "status",
            "created_at",
            "paymob_transaction_id",
            "paymob_order_id",
            "paymob_payment_key",
            "response_payload",
        ]
        read_only_fields = [
            "status",
            "created_at",
            "paymob_transaction_id",
            "paymob_order_id",
            "paymob_payment_key",
            "response_payload",
        ]
