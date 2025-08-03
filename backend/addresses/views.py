from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Address
from .serializers import AddressSerializer
from accounts.models import CustomerProfile

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # The serializer handles setting the user and is_default logic
        serializer.save()

    @action(detail=True, methods=['post'], url_path='set-default')
    def set_default(self, request, pk=None):
        address = self.get_object()

        if address.user != request.user:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        # Set all user's addresses to not default
        Address.objects.filter(user=request.user).update(is_default=False)

        # Set selected address as default
        address.is_default = True
        address.save(update_fields=["is_default"])

        # Update customer profile
        try:
            profile = request.user.customerprofile
            profile.default_shipping_address = address
            profile.save(update_fields=["default_shipping_address"])
        except CustomerProfile.DoesNotExist:
            CustomerProfile.objects.create(user=request.user, default_shipping_address=address)

        return Response({"detail": "Default shipping address set."})