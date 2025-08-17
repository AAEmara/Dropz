import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import ShippingCompany


@pytest.mark.django_db
class TestShipperMeEndpoint:

    @pytest.fixture
    def shipper_user(self, django_user_model):
        return django_user_model.objects.create_user(
            email="shipper@example.com",
            password="shipperPass123",
            role="shipping_company",
        )

    @pytest.fixture
    def customer_user(self, django_user_model):
        return django_user_model.objects.create_user(
            email="customer@example.com",
            password="customerPass123",
            role="customer",
        )

    @pytest.fixture
    def auth_shipper_client(self, client, shipper_user):
        """Return an API client authenticated as `shipper_user`"""
        refresh = RefreshToken.for_user(shipper_user)
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        return client

    @pytest.fixture
    def auth_customer_client(self, client, customer_user):
        """Return an API client authenticated as `customer_user`"""
        refresh = RefreshToken.for_user(customer_user)
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        return client

    @pytest.fixture
    def shipping_company(self, shipper_user):
        return ShippingCompany.objects.create(
            user=shipper_user,
            company_name="FastShip",
            company_person="John Doe",
            contract_signed=True,
        )

    def test_get_shipping_company(self, auth_shipper_client, shipping_company):
        url = reverse("shipper-me")
        response = auth_shipper_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["company_name"] == shipping_company.company_name
        assert (
            response.data["company_person"] == shipping_company.company_person
        )

    def test_get_nonexistent_shipping_company(self, auth_shipper_client):
        url = reverse("shipper-me")
        response = auth_shipper_client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_shipping_company(
        self, auth_shipper_client, shipping_company
    ):
        url = reverse("shipper-me")
        payload = {"company_name": "SpeedyShip"}
        response = auth_shipper_client.patch(url, payload)
        assert response.status_code == status.HTTP_200_OK
        shipping_company.refresh_from_db()
        assert shipping_company.company_name == "SpeedyShip"

    def test_cannot_update_contract_signed(
        self, auth_shipper_client, shipping_company
    ):
        url = reverse("shipper-me")
        payload = {"contract_signed": False}
        response = auth_shipper_client.patch(url, payload)
        assert response.status_code == status.HTTP_200_OK
        shipping_company.refresh_from_db()
        assert shipping_company.contract_signed is True  # unchanged

    def test_role_not_shipping_company_denied(self, auth_customer_client):
        url = reverse("shipper-me")
        response = auth_customer_client.get(url)
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert "Only shipping companies" in response.data["detail"]

    def test_unauthenticated_access_denied(self, client):
        url = reverse("shipper-me")
        response = client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
