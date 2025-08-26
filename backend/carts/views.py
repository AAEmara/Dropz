from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView
from rest_framework import status

from .models import Cart, CartItem
from .serializers import (
    CartItemSerializer,
    AddCartItemSerializer,
    UpdateCartItemSerializer,
)
from .permissions import IsCustomer
from products.models import Product


class CartItemListView(ListAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsCustomer]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user).order_by('id')


class CartItemDetailView(RetrieveAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsCustomer]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)


class AddCartItemView(CreateAPIView):
    serializer_class = AddCartItemSerializer
    permission_classes = [IsCustomer]

    def get_cart(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart

    def get_serializer_context(self):
        return {"cart": self.get_cart()}

    def create(self, request, *args, **kwargs):
        cart = self.get_cart()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data["product_id"]
        quantity = serializer.validated_data["quantity"]

        product = Product.objects.get(pk=product_id)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product_id=product_id,
            defaults={"quantity": quantity},
        )

        if not created:
            new_quantity = cart_item.quantity + quantity
            if new_quantity > product.stock_quantity:
                return Response(
                    {
                        "detail": (
                            "Sorry, this quantity ("
                            f"{new_quantity}) exceeds stock ("
                            f"{product.stock_quantity})"
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            cart_item.quantity = new_quantity
            cart_item.save()
            return Response(
                {
                    "detail": "Quantity updated successfully.",
                    "product_id": product_id,
                    "new_quantity": cart_item.quantity,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "detail": "Item added to cart successfully.",
                "product_id": product_id,
                "quantity": quantity,
            },
            status=status.HTTP_201_CREATED,
        )


class UpdateCartItemQuantityView(APIView):
    permission_classes = [IsCustomer]

    def patch(self, request, pk):
        try:
            cart_item = CartItem.objects.get(pk=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response(
                {"detail": "Cart item not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = UpdateCartItemSerializer(
            cart_item, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IncreaseCartItemQuantityView(APIView):
    permission_classes = [IsCustomer]

    def post(self, request, pk):
        try:
            cart_item = CartItem.objects.get(pk=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response(
                {"detail": "Cart item not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if cart_item.quantity + 1 > cart_item.product.stock_quantity:
            return Response(
                {"detail": "Not enough stock"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_item.quantity += 1
        cart_item.save()

        return Response(
            {
                "detail": "Quantity increased.",
                "product_id": cart_item.product.id,
                "quantity": cart_item.quantity,
            },
            status=status.HTTP_200_OK,
        )


class DecreaseCartItemQuantityView(APIView):
    permission_classes = [IsCustomer]

    def post(self, request, pk):
        try:
            cart_item = CartItem.objects.get(pk=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response(
                {"detail": "Cart item not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if cart_item.quantity == 1:
            return Response(
                {"detail": "Quantity cannot be less than 1."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_item.quantity -= 1
        cart_item.save()
        return Response(
            {
                "detail": "Quantity decreased.",
                "product_id": cart_item.product.id,
                "quantity": cart_item.quantity,
            },
            status=status.HTTP_200_OK,
        )


class DeleteCartItemView(APIView):
    permission_classes = [IsCustomer]

    def delete(self, request, pk):
        try:
            cart_item = CartItem.objects.get(pk=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response(
                {"detail": "Cart item not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart_item.delete()
        return Response(
            {"detail": "Item removed from cart successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )
