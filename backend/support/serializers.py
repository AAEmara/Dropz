from rest_framework import serializers
from .models import SupportTicket, TicketMessage


class TicketMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.email", read_only=True)

    class Meta:
        model = TicketMessage
        fields = ["id", "sender", "sender_name", "message", "created_at"]
        read_only_fields = ["sender", "created_at"]


class SupportTicketSerializer(serializers.ModelSerializer):
    customer_email = serializers.CharField(
        source="customer.email", read_only=True
    )
    messages = TicketMessageSerializer(many=True, read_only=True)

    class Meta:
        model = SupportTicket
        fields = [
            "id",
            "customer",
            "customer_email",
            "subject",
            "description",
            "status",
            "created_at",
            "updated_at",
            "messages",
        ]
        read_only_fields = ["customer", "created_at", "updated_at"]
