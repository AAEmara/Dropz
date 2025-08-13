from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Address
from .serializers import AddressSerializer


class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    @action(detail=True, methods=["patch"], url_path="set-default")
    def set_default(self, request, pk=None):
        address = self.get_object()

        if address.user != request.user:
            return Response(
                {"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN
            )

        if request.user.role != "customer":
            return Response(
                {"detail": "Only customers can set default addresses."},
                status=403,
            )

        # Call the serializer's update() with `is_default=True`,
        # and eliminates redundancy.
        serializer = self.get_serializer(
            address, data={"is_default": True}, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"detail": "Default shipping address set."})
