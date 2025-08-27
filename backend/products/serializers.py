from rest_framework import serializers
from .models import Product, Category
from .models import ProductReview
from wishlists.models import WishlistItem


class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "parent_category", "subcategories"]

    def get_subcategories(self, obj):
        return CategorySerializer(obj.subcategories.all(), many=True).data


class ProductSerializer(serializers.ModelSerializer):
    seller = serializers.StringRelatedField()
    is_in_wishlist = serializers.SerializerMethodField()
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = [
            "id",
            "slug",
            "seller",
            "created_at",
            "updated_at",
            "is_in_wishlist",
        ]

    def get_is_in_wishlist(self, obj):
        request = self.context.get("request")
        if not request or request.user.is_anonymous:
            return False

        customer_profile = getattr(request.user, "customerprofile", None)
        if not customer_profile:
            return False

        return WishlistItem.objects.filter(
            wishlist__customer=customer_profile, product=obj
        ).exists()

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Price must be greater than zero."
            )
        return value

    def validate_stock_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Stock quantity cannot be negative."
            )
        return value


class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = ["id", "product", "user", "rating", "comment", "created_at"]
        read_only_fields = ["id", "user", "created_at", "product"]

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError(
                "Rating must be between 1 and 5."
            )
        return value

    def validate_comment(self, value):
        if len(value.strip()) < 8:
            raise serializers.ValidationError(
                "Comment must be at least 8 characters long."
            )
        return value
