import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User, Roles
from accounts.models import CustomerProfile, SellerAccount
from products.models import Product, Category
from .models import Wishlist, WishlistItem


pytestmark = pytest.mark.django_db


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def seller_account(seller_user):
    return SellerAccount.objects.create(
        user=seller_user,
        company_name="Test Company",
        business_license="BL123456",
        tax_id="TAX7890",
        verified=True,
        account_status="active",
    )


@pytest.fixture
def customer_user():
    user = User.objects.create_user(
        email="customer@example.com",
        password="CustomerUser@123",
        first_name="John",
        last_name="Doe",
        role=Roles.CUSTOMER
    )
    CustomerProfile.objects.create(user=user)
    return user


@pytest.fixture
def seller_user():
    return User.objects.create_user(
        email="seller@example.com",
        password="SellerUser@123",
        first_name="Jane",
        last_name="Smith",
        role=Roles.SELLER
    )


@pytest.fixture
def sample_product(seller_account, category):
    return Product.objects.create(
        seller=seller_account,
        title="Test Product",
        description="A sample product",
        price=100.0,
        stock_quantity=10,
        is_active=True,
        category=category,
    )


@pytest.fixture
def category():
    return Category.objects.create(name="Electronics")


def auth_client(client, user):
    client.force_authenticate(user=user)
    return client


# -----------------------
# GET wishlist
# -----------------------


def test_get_wishlist_authenticated_customer(
    api_client, customer_user, seller_user, seller_account
):
    client = auth_client(api_client, customer_user)
    url = reverse("wishlist")
    response = client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert "items" in response.data


def test_get_wishlist_non_customer(api_client, seller_user, seller_account):
    client = auth_client(api_client, seller_user)
    url = reverse("wishlist")
    response = client.get(url)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_get_wishlist_unauthenticated(api_client):
    url = reverse("wishlist")
    response = api_client.get(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


# -----------------------
# Add to wishlist
# -----------------------


def test_add_product_to_wishlist(
    api_client, customer_user, seller_user, seller_account, sample_product
):
    client = auth_client(api_client, customer_user)
    url = reverse("wishlist-add")
    response = client.post(url, {"product_id": sample_product.id})
    assert response.status_code == status.HTTP_201_CREATED
    wishlist = Wishlist.objects.get(customer__user=customer_user)
    assert wishlist.items.count() == 1


def test_add_duplicate_product(
    api_client, customer_user, seller_user, seller_account, sample_product
):
    client = auth_client(api_client, customer_user)
    url = reverse("wishlist-add")
    # First add
    client.post(url, {"product_id": sample_product.id})
    # Try duplicate
    response = client.post(url, {"product_id": sample_product.id})
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "already in wishlist" in response.data["detail"].lower()


def test_add_product_non_customer(
    api_client, seller_user, seller_account, sample_product
):
    client = auth_client(api_client, seller_user)
    url = reverse("wishlist-add")
    response = client.post(url, {"product_id": sample_product.id})
    assert response.status_code == status.HTTP_403_FORBIDDEN


# -----------------------
# Remove from wishlist
# -----------------------


def test_remove_product_from_wishlist(
    api_client, customer_user, seller_user, seller_account, sample_product
):
    client = auth_client(api_client, customer_user)
    wishlist, _ = Wishlist.objects.get_or_create(
        customer=CustomerProfile.objects.get(user=customer_user)
    )
    WishlistItem.objects.create(wishlist=wishlist, product=sample_product)

    url = reverse("wishlist-remove", args=[sample_product.id])
    response = client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert wishlist.items.count() == 0


def test_remove_nonexistent_product(
    api_client, seller_user, seller_account, customer_user
):
    client = auth_client(api_client, customer_user)
    url = reverse(
        "wishlist-remove", args=[999]
    )  # Non-existent product ID
    response = client.delete(url)
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_remove_product_non_customer(
    api_client, seller_user, seller_account, sample_product
):
    client = auth_client(api_client, seller_user)
    url = reverse("wishlist-remove", args=[sample_product.id])
    response = client.delete(url)
    assert response.status_code == status.HTTP_403_FORBIDDEN
