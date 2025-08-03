import re
from rest_framework import serializers
from .models import Address
from accounts.models import CustomerProfile

EGYPT_GOVERNORATES = [
    "Cairo", "Alexandria", "Giza", "Aswan", "Luxor", "Suez", "Port Said", "Ismailia", "Dakahlia",
    "Qalyubia", "Sharqia", "Beheira", "Gharbia", "Monufia", "Faiyum", "Beni Suef", "Minya", "Sohag",
    "Qena", "Assiut", "Red Sea", "New Valley", "North Sinai", "South Sinai", "Matruh", "Damietta",
    "Kafr El Sheikh"
]

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ['user']

    def validate_postal_code(self, value):
        if not re.match(r"^\d{5}$", value):
            raise serializers.ValidationError("Postal code must be 5 digits.")
        return value

    def validate_city(self, value):
        if not value.strip():
            raise serializers.ValidationError("City is required.")
        return value

    def validate_governorate(self, value):
        if value not in EGYPT_GOVERNORATES:
            raise serializers.ValidationError("Invalid governorate.")
        return value

    def validate_country(self, value):
        if value.strip().lower() != "egypt":
            raise serializers.ValidationError("Country must be 'Egypt'.")
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        is_default = validated_data.pop("is_default", False)

        address = Address.objects.create(user=user, **validated_data)

        if is_default:
            address.is_default = True
            address.save(update_fields=["is_default"])

            try:
                profile = user.customerprofile
                profile.default_shipping_address = address
                profile.save(update_fields=["default_shipping_address"])
            except CustomerProfile.DoesNotExist:
                CustomerProfile.objects.create(user=user, default_shipping_address=address)

        return address

    def update(self, instance, validated_data):
        is_being_defaulted = validated_data.get("is_default", instance.is_default)
        updated_address = super().update(instance, validated_data)

        if is_being_defaulted:
            updated_address.is_default = True
            updated_address.save(update_fields=["is_default"])

            try:
                profile = updated_address.user.customerprofile
                profile.default_shipping_address = updated_address
                profile.save(update_fields=["default_shipping_address"])
            except CustomerProfile.DoesNotExist:
                CustomerProfile.objects.create(user=updated_address.user, default_shipping_address=updated_address)
        else:
            try:
                profile = updated_address.user.customerprofile
                if profile.default_shipping_address == updated_address:
                    profile.default_shipping_address = None
                    profile.save(update_fields=["default_shipping_address"])
            except CustomerProfile.DoesNotExist:
                pass

        return updated_address