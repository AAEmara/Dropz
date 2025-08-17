from rest_framework import generics, status
from rest_framework.response import Response
from .models import Wishlist, WishlistItem
from .serializers import WishlistSerializer, WishlistAddSerializer
from products.models import Product
from accounts.models import CustomerProfile
from .permissions import IsAuthenticatedCustomer


class WishlistView(generics.RetrieveAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticatedCustomer]

    def get_object(self):
        customer_profile = CustomerProfile.objects.get(user=self.request.user)
        wishlist, _ = Wishlist.objects.get_or_create(customer=customer_profile)
        return wishlist


class WishlistAddView(generics.GenericAPIView):
    serializer_class = WishlistAddSerializer
    permission_classes = [IsAuthenticatedCustomer]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        customer_profile = CustomerProfile.objects.get(user=request.user)
        wishlist, _ = Wishlist.objects.get_or_create(customer=customer_profile)
        product = Product.objects.get(id=serializer.validated_data['product_id'])

        if WishlistItem.objects.filter(wishlist=wishlist, product=product).exists():
            return Response({"detail": "Product already in wishlist."}, status=status.HTTP_400_BAD_REQUEST)

        WishlistItem.objects.create(wishlist=wishlist, product=product)
        return Response({"detail": "Product added to wishlist."}, status=status.HTTP_201_CREATED)


class WishlistRemoveView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticatedCustomer]

    def delete(self, request, product_id):
        customer_profile = CustomerProfile.objects.get(user=request.user)
        wishlist, _ = Wishlist.objects.get_or_create(customer=customer_profile)
        item = WishlistItem.objects.filter(wishlist=wishlist, product_id=product_id).first()

        if not item:
            return Response({"detail": "Product not in wishlist."}, status=status.HTTP_404_NOT_FOUND)

        item.delete()
        return Response({"detail": "Product removed from wishlist."}, status=status.HTTP_204_NO_CONTENT)
