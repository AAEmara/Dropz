import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from accounts.models import CustomerProfile
from addresses.models import Address

@pytest.mark.django_db
def test_create_valid_address_sets_default():
    user = get_user_model().objects.create_user(
        email='test@example.com',
        password='test123',
        first_name='Test',
        last_name='User',
        role='customer'
    )
    CustomerProfile.objects.create(user=user)

    client = APIClient()
    client.force_authenticate(user=user)

    payload = {
        "street": "12 Ramses St",
        "city": "Cairo",
        "governorate": "Cairo",
        "postal_code": "12345",
        "country": "Egypt",
        "is_default": True
    }

    response = client.post("/api/addresses/", payload)
    assert response.status_code == 201, response.data

    address_id = response.data["id"]
    address = Address.objects.get(id=address_id)
    assert address.is_default is True

    profile = CustomerProfile.objects.get(user=user)
    assert profile.default_shipping_address == address

@pytest.mark.django_db
def test_set_default_via_action():
    user = get_user_model().objects.create_user(
        email='default@example.com',
        password='test123',
        first_name='Test',
        last_name='User',
        role='customer'
    )
    CustomerProfile.objects.create(user=user)

    client = APIClient()
    client.force_authenticate(user=user)

    addr1 = Address.objects.create(
        user=user,
        street="A",
        city="Cairo",
        governorate="Cairo",
        postal_code="12345",
        country="Egypt",
        is_default=False
    )
    addr2 = Address.objects.create(
        user=user,
        street="B",
        city="Giza",
        governorate="Giza",
        postal_code="54321",
        country="Egypt",
        is_default=False
    )

    response = client.post(f"/api/addresses/{addr2.id}/set-default/")
    assert response.status_code == 200, response.data

    addr1.refresh_from_db()
    addr2.refresh_from_db()
    profile = CustomerProfile.objects.get(user=user)

    assert addr1.is_default is False
    assert addr2.is_default is True
    assert profile.default_shipping_address == addr2