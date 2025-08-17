import pytest
from django.urls import reverse
from rest_framework import status
from accounts.models import User, CustomerProfile


@pytest.mark.django_db
class TestCustomerWorkflow:

    @pytest.fixture
    def register_url(self):
        return reverse("register")

    @pytest.fixture
    def address_url(self):
        return reverse("addresses-list")

    @pytest.fixture
    def customer_user_data(self):
        return {
            "email": "mohussien@gmail.com",
            "first_name": "Mohamed",
            "last_name": "Hussien",
            "role": "customer",
            "password": "mo_Hussien@123",
            "confirm_password": "mo_Hussien@123",
        }

    @pytest.fixture
    def customer_address_data(self):
        return {
            "street": "13th Building, Alwaheed, Al Moshier Street",
            "city": "Alexandria",
            "governorate": "Alexandria",
            "postal_code": "21523",
            "country": "Egypt",
        }

    def test_register_customer_success(
        self, client, register_url, customer_user_data
    ):
        # Checks successful creation response
        response = client.post(register_url, customer_user_data, format="json")
        assert response.status_code == status.HTTP_201_CREATED

        # Checks user creation in the database
        user = User.objects.get(email=customer_user_data["email"])
        assert user.role == "customer"

        # Checks customer profile creation in the database
        customer_profile = CustomerProfile.objects.get(user=user)
        assert customer_profile.default_shipping_address is None

    def test_register_customer_fails_existing_email(
        self, client, register_url, customer_user_data
    ):
        user_data = dict()
        for key, val in customer_user_data.items():
            if key in ["email", "first_name", "last_name", "role", "password"]:
                user_data[key] = val
        User.objects.create(**user_data)

        response = client.post(register_url, customer_user_data, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data

    def test_register_customer_fails_invalid_password(
        self, client, register_url, customer_user_data
    ):
        customer_user_data["password"] = "weak"
        customer_user_data["confirm_password"] = "weak"

        response = client.post(register_url, customer_user_data, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "password" in response.data

    def test_register_customer_fails_invalid_role(
        self, client, register_url, customer_user_data
    ):
        customer_user_data["role"] = "invalid_role"

        response = client.post(register_url, customer_user_data, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "role" in response.data

    def test_customer_profile_retrieve_success(
        self, client, django_user_model
    ):
        user = django_user_model.objects.create_user(
            email="mohussien@gmail.com",
            first_name="Mohamed",
            last_name="Hussien",
            role="customer",
            password="mo_Hussien@123",
            phone_number="0123456789",
        )

        # Creating a CustomerProfile for the user
        CustomerProfile.objects.create(user=user)

        # Logging with the user's account in "customer" role
        client.force_authenticate(user=user)
        url = reverse("customer-me")

        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["default_shipping_address"] is None
        assert response.data["loyalty_points"] == 0

    def test_customer_profile_update_success(
        self, client, django_user_model, address_url, customer_address_data
    ):
        user = django_user_model.objects.create_user(
            email="mohussien@gmail.com",
            first_name="Mohamed",
            last_name="Hussien",
            role="customer",
            password="mo_Hussien@123",
            phone_number="0123456789",
        )

        # Creating a CustomerProfile for the user
        customer = CustomerProfile.objects.create(user=user)

        client.force_authenticate(user=user)
        url = reverse("customer-me")

        # Creating a default address attached to the CustomerProfile
        response = client.post(
            address_url, customer_address_data, format="json"
        )
        assert response.status_code == status.HTTP_201_CREATED
        created_address_id = response.data["id"]
        assert not response.data["is_default"]

        # Updating restricted fields, which shouldn't change
        old_loyalty_points = customer.loyalty_points
        old_default_address_id = customer.default_shipping_address_id
        response = client.patch(
            url,
            {
                "default_shipping_address": created_address_id,
                "loyalty_points": 3000,
            },
            format="json",
        )
        customer.refresh_from_db()
        assert customer.loyalty_points == old_loyalty_points
        assert customer.default_shipping_address_id == old_default_address_id
