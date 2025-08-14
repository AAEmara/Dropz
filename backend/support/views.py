from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound, PermissionDenied
from .models import SupportTicket, TicketMessage
from .serializers import SupportTicketSerializer, TicketMessageSerializer


def is_support(user):
    """
    Check if a user is either a support_staff or has Django staff status.
    Assumes 'role' field exists in the user model for custom role management.
    """
    return getattr(user, "role", "") == "support_staff" or user.is_staff


class TicketListCreateView(generics.ListCreateAPIView):
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Support staff see all tickets but customers see only their own
        if is_support(user):
            return SupportTicket.objects.all().order_by("-created_at")
        return SupportTicket.objects.filter(customer=user).order_by(
            "-created_at"
        )

    def perform_create(self, serializer):
        # Customers create their own tickets
        serializer.save(customer=self.request.user)


class TicketDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if is_support(user):
            return SupportTicket.objects.all()
        return SupportTicket.objects.filter(customer=user)

    def perform_update(self, serializer):
        user = self.request.user
        # Only support staff can change status
        if "status" in serializer.validated_data and not is_support(user):
            raise PermissionDenied(
                "Only support staff can change ticket status."
            )
        serializer.save()


class TicketMessageListCreateView(generics.ListCreateAPIView):
    serializer_class = TicketMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        ticket_id = self.kwargs["ticket_id"]
        user = self.request.user

        try:
            ticket = SupportTicket.objects.get(pk=ticket_id)
        except SupportTicket.DoesNotExist:
            raise NotFound("Ticket not found")

        # Support see all messages but customers see their own messages
        if is_support(user):
            return TicketMessage.objects.filter(ticket_id=ticket_id).order_by(
                "created_at"
            )
        if ticket.customer == user:
            return TicketMessage.objects.filter(ticket_id=ticket_id).order_by(
                "created_at"
            )

        raise PermissionDenied(
            "You don't have permission to access this ticket"
        )

    def perform_create(self, serializer):
        ticket_id = self.kwargs["ticket_id"]
        try:
            ticket = SupportTicket.objects.get(pk=ticket_id)
        except SupportTicket.DoesNotExist:
            raise NotFound("Ticket not found")

        user = self.request.user
        # Only ticket owner or support staff can add a message
        if not (is_support(user) or ticket.customer == user):
            raise PermissionDenied(
                "You don't have permission to add messages to this ticket"
            )

        serializer.save(sender=user, ticket_id=ticket_id)
