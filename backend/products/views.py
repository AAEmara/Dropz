from rest_framework import viewsets, generics, permissions, status, filters
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Product, Category, ProductReview
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    ProductReviewSerializer,
)
from .permissions import IsCustomer, IsOwnerOrReadOnly, IsSellerOrReadOnly
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from .pagination import ProductPagination
from .filters import ProductFilter


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsSellerOrReadOnly]
    pagination_class = ProductPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ProductFilter
    search_fields = ["title", "description"]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user.selleraccount)


class ProductReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductReviewSerializer

    def get_queryset(self):
        product_slug = self.kwargs["product_slug"]
        return ProductReview.objects.filter(product__slug=product_slug)

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsCustomer()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        product_slug = self.kwargs["product_slug"]
        product = Product.objects.get(slug=product_slug)
        user = self.request.user
        if ProductReview.objects.filter(product=product, user=user).exists():
            raise ValidationError("You have already reviewed this product")
        serializer.save(user=self.request.user, product=product)


class ProductReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductReview.objects.all()
    serializer_class = ProductReviewSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"detail": "Review deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )
