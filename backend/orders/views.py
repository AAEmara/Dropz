from rest_framework import status, viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from carts.models import Cart, CartItem
from .models import Order, OrderItem
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


# orders/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from carts.models import Cart
from .models import Order, OrderItem
from addresses.models import Address
from .serializers import OrderSerializer


class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]

    def post(self, request, *args, **kwargs):
        user = request.user

        # Get user's cart
        try:
            cart = user.cart
        except Cart.DoesNotExist:
            return Response({"detail": "Cart does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        cart_items = cart.items.all()
        if not cart_items.exists():
            return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        # Get shipping address
        shipping_address_id = request.data.get("shipping_address_id")
        shipping_address = None

        if shipping_address_id:
            try:
                shipping_address = Address.objects.get(id=shipping_address_id, user=user)
            except Address.DoesNotExist:
                return Response({"detail": "Invalid address."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # fallback to default address
            shipping_address = Address.objects.filter(user=user, is_default=True).first()
            if not shipping_address:
                return Response({"detail": "No shipping address found."}, status=status.HTTP_400_BAD_REQUEST)

        # Create order
        order = Order.objects.create(
            user=user,
            status="pending",
            shipping_address=shipping_address,
        )

        # Convert cart items -> order items
        order_items = [
            OrderItem(
                order=order,
                product=item.product,
                quantity=item.quantity,
                unit_price=item.product.price,  # snapshot
            )
            for item in cart_items
        ]
        OrderItem.objects.bulk_create(order_items)

        # Empty cart
        cart_items.delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
