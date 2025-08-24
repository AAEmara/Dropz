from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Order
from .serializers import OrderSerializer


class IsOwnerOrStaff(permissions.BasePermission):
    """Allow only order owner or staff"""

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.user == request.user


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().order_by("-created_at")
        return Order.objects.filter(user=user).order_by("-created_at")

    def perform_update(self, serializer):

        # Prevent changing status directly unless staff
        if (
            not self.request.user.is_staff
            and "status" in serializer.validated_data
        ):
            raise PermissionDenied("You cannot update order status manually.")

        serializer.save()
