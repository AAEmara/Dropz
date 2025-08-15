from rest_framework import serializers
from .models import Cart, CartItem
from products.serializers import ProductSerializer
from products.models import Product

class CartItemSerializer(serializers.ModelSerializer):
    cart_item_id = serializers.IntegerField(source="id", read_only=True)
    item_subtotal = serializers.SerializerMethodField()
    product = ProductSerializer(read_only=True)
    status = serializers.SerializerMethodField()
    message = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "cart_item_id",
            "product",
            "quantity",
            "item_subtotal",
            "status",
            "message",
        ]

    def get_status(self, obj):
        if not obj.product.is_active:
            return "unavailable"
        if obj.product.stock_quantity == 0:
            return "out_of_stock"
        return "available"

    def get_message(self, obj):
        status = self.get_status(obj)

        messages = {
            "unavailable": "This product is no longer available",
            "out_of_stock": "This product is out of stock",
            "available": "Product is available and in stock",
        }

        return messages.get(status, "Product status unknown")

    def get_item_subtotal(self, obj):
        return obj.item_subtotal


class AddCartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField()

    class Meta:
        model = CartItem
        fields = ["product_id", "quantity"]

    def validate(self, data):
        product_id = data.get("product_id")
        quantity = data.get("quantity")

        if quantity <= 0:
            raise serializers.ValidationError(
                "Quantity must be greater than 0."
            )

        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product does not exist.")

        if not product.is_active:
            raise serializers.ValidationError(
                "This product is not available anymore."
            )

        cart = self.context["cart"]
        existing_item = CartItem.objects.filter(
            cart=cart, product=product
        ).first()
        total_quantity = quantity
        if existing_item:
            total_quantity += existing_item.quantity

        if total_quantity > product.stock_quantity:
            raise serializers.ValidationError("Not enough stock available.")

        return data

    def create(self, validated_data):
        cart = self.context["cart"]
        product_id = validated_data["product_id"]
        quantity = validated_data["quantity"]

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, product_id=product_id, defaults={"quantity": quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return cart_item


class UpdateCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ["quantity"]

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")

        cart_item = self.instance
        if value > cart_item.product.stock_quantity:
            raise serializers.ValidationError("Not enough stock available.")
        return value


class CartSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    count = serializers.SerializerMethodField()

    def get_count(self, obj):
        cart_items = obj.cart_items.all()
        return len(cart_items)

    def get_total_price(self, obj):
        cart_items = obj.cart_items.all()
        return sum(cart_item.item_subtotal for cart_item in cart_items)

    class Meta:
        model = Cart
        fields = (
            "created_at",
            "updated_at",
            "id",
            "user",
            "cart_items",
            "total_price",
            "count",
        )
        extra_kwargs = {
            field.name: {"read_only": True} for field in Cart._meta.fields
        }
