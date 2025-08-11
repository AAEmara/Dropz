from rest_framework import serializers
from .models import Product, Category
from .models import ProductReview


class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "parent_category", "subcategories"]

    def get_subcategories(self, obj):
        return CategorySerializer(obj.subcategories.all(), many=True).data


class ProductSerializer(serializers.ModelSerializer):
    seller = serializers.StringRelatedField()

    class Meta:
        model = Product
        fields = "__all__"


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
