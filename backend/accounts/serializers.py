from rest_framework import serializers
from django.contrib.auth import get_user_model
import re
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from .models import CustomerProfile, SellerAccount, ShippingCompany


User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "confirm_password",
            "first_name",
            "last_name",
            "phone_number",
            "role",
        ]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long."
            )
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter."
            )
        if not re.search(r"\d", value):
            raise serializers.ValidationError(
                "Password must contain at least one number."
            )
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise serializers.ValidationError(
                "Password must contain at least one special character."
            )
        return value

    def validate_role(self, value):
        valid_roles = ["customer", "seller", "shipping_company"]
        if value not in valid_roles:
            raise serializers.ValidationError("Invalid role selected.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("Passwords should match.")
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = User.objects.create_user(**validated_data)

        if user.role == "customer":
            CustomerProfile.objects.create(user=user)
        elif user.role == "seller":
            SellerAccount.objects.create(
                user=user, company_name="", business_license="", tax_id=""
            )
        elif user.role == "shipping_company":
            ShippingCompany.objects.create(
                user=user, company_name="", company_person=""
            )

        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["user_id"] = str(user.id)
        token["role"] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data.update(
            {
                "user": {
                    "first_name": self.user.first_name,
                    "last_name": self.user.last_name,
                }
            }
        )
        return data


class MyTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        request = self.context["request"]
        refresh = attrs.get("refresh") or request.COOKIES.get("refresh_token")
        if refresh is None:
            raise serializers.ValidationError(
                {"refresh": "Refresh token is required."}
            )

        attrs["refresh"] = refresh

        return super().validate(attrs)


class SellerAccountSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email")
    user_first_name = serializers.CharField(source="user.first_name")
    user_last_name = serializers.CharField(source="user.last_name")
    user_phone_number = serializers.CharField(source="user.phone_number")

    class Meta:
        model = SellerAccount
        fields = [
            "user_email",
            "user_first_name",
            "user_last_name",
            "user_phone_number",
            "company_name",
            "business_license",
            "tax_id",
            "verified",
            "account_status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "verified",
            "account_status",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        request = self.context.get("request")
        user = request.user if request else None

        if not user or not user.is_authenticated:
            raise serializers.ValidationError("Authentication is required.")

        if user.role != "seller":
            raise serializers.ValidationError(
                (
                    "Only users with the 'seller' "
                    "role can create a seller account."
                )
            )

        if (
            self.instance is None
            and SellerAccount.objects.filter(user=user).exists()
        ):
            raise serializers.ValidationError(
                "You already have a seller account."
            )

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        return SellerAccount.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("verified", None)
        validated_data.pop("account_status", None)
        return super().update(instance, validated_data)
