import pytest
from django.urls import reverse
from rest_framework import status
from accounts.models import User, SellerAccount


@pytest.mark.django_db
class TestSellerWorkflow:

    @pytest.fixture
    def register_url(self):
        return reverse("register")

    @pytest.fixture
    def seller_user_data(self):
        return {
            "email": "ahmed@gmail.com",
            "first_name": "Ahmed",
            "last_name": "Ramadan",
            "role": "seller",
            "password": "ahmed_Ramadan@123",
            "confirm_password": "ahmed_Ramadan@123",
        }

    def test_register_seller_success(
        self, client, register_url, seller_user_data
    ):
        # Checks successful creation response
        response = client.post(register_url, seller_user_data, format="json")
        assert response.status_code == status.HTTP_201_CREATED

        # Checks user creation in the database
        user = User.objects.get(email=seller_user_data["email"])
        assert user.role == "seller"

        # Checks seller profile creation in the database
        seller_profile = SellerAccount.objects.get(user=user)
        assert seller_profile.company_name == ""
        assert seller_profile.business_license == ""
        assert seller_profile.tax_id == ""
        assert seller_profile.account_status == "pending"
        assert seller_profile.verified is False

    def test_register_seller_fails_existing_email(
        self, client, register_url, seller_user_data
    ):
        user_data = dict()
        for key, val in seller_user_data.items():
            if key in ["email", "first_name", "last_name", "role", "password"]:
                user_data[key] = val
        User.objects.create(**user_data)

        response = client.post(register_url, seller_user_data, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data

    def test_register_seller_fails_invalid_password(
        self, client, register_url, seller_user_data
    ):
        seller_user_data["password"] = "weak"
        seller_user_data["confirm_password"] = "weak"

        response = client.post(register_url, seller_user_data, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "password" in response.data

    def test_register_seller_fails_invalid_role(
        self, client, register_url, seller_user_data
    ):
        seller_user_data["role"] = "invalid_role"

        response = client.post(register_url, seller_user_data, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "role" in response.data

    def test_seller_profile_retrieve_success(self, client, django_user_model):
        user = django_user_model.objects.create_user(
            email="ahmed@gmail.com",
            first_name="Ahmed",
            last_name="Ramadan",
            role="seller",
            password="ahmed_Ramadan@123",
            phone_number="0123456789",
        )

        # Creating a SellerAccount for the user
        SellerAccount.objects.create(
            user=user,
            company_name="Chefco",
            business_license="213451",
            tax_id="34190321",
        )

        # Logging with the user's account in "seller" role
        client.force_authenticate(user=user)
        url = reverse("seller-me")

        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["company_name"] == "Chefco"
        assert response.data["business_license"] == "213451"
        assert response.data["tax_id"] == "34190321"

    def test_seller_profile_update_success(self, client, django_user_model):
        user = django_user_model.objects.create_user(
            email="ahmed@gmail.com",
            first_name="Ahmed",
            last_name="Ramadan",
            role="seller",
            password="ahmed_Ramadan@123",
            phone_number="0123456789",
        )

        # Creating a SellerAccount for the user
        seller = SellerAccount.objects.create(
            user=user,
            company_name="Chefco",
            business_license="213451",
            tax_id="34190321",
        )

        client.force_authenticate(user=user)
        url = reverse("seller-me")

        # Updating allowed fields
        response = client.patch(
            url, {"company_name": "Italian Chef"}, format="json"
        )
        assert response.status_code == status.HTTP_200_OK
        seller.refresh_from_db()
        assert seller.company_name == "Italian Chef"

        # Updating restricted fields, which shouldn't change
        response = client.patch(
            url, {"verified": True, "account_status": "active"}, format="json"
        )
        seller.refresh_from_db()
        assert seller.verified is False
        assert seller.account_status == "pending"
