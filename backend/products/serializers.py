from rest_framework import serializers
from .models import Product, Category


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
        read_only_fields = ['id', 'slug', 'seller', 'created_at', 'updated_at']

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value

    def validate_stock_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock quantity cannot be negative.")
        return value
