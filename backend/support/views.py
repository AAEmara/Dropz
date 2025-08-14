from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound, PermissionDenied
from .models import SupportTicket, TicketMessage
from .serializers import SupportTicketSerializer, TicketMessageSerializer


class TicketListCreateView(generics.ListCreateAPIView):
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return SupportTicket.objects.all()
        return SupportTicket.objects.filter(customer=user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


class TicketDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return SupportTicket.objects.all()
        return SupportTicket.objects.filter(customer=user)


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

        # Check permissions
        if not (user.is_staff or ticket.customer == user):
            raise PermissionDenied(
                "You don't have permission to access this ticket"
            )

        # Return all messages for the ticket, ordered chronologically
        return TicketMessage.objects.filter(ticket_id=ticket_id).order_by(
            "created_at"
        )

    def perform_create(self, serializer):
        ticket_id = self.kwargs["ticket_id"]
        try:
            ticket = SupportTicket.objects.get(pk=ticket_id)
            if not (
                self.request.user.is_staff
                or ticket.customer == self.request.user
            ):
                raise PermissionDenied(
                    "You don't have permission to add messages to this ticket"
                )
            serializer.save(sender=self.request.user, ticket_id=ticket_id)
        except SupportTicket.DoesNotExist:
            raise NotFound("Ticket not found")
