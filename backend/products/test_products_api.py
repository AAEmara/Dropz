import pytest
from django.urls import reverse
from rest_framework import status
from products.models import Product
from rest_framework.test import APIClient
from accounts.models import SellerAccount
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image


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
def seller_user(django_user_model):
    return django_user_model.objects.create_user(
        email="seller@example.com",
        password="SellerUser@123",
        first_name="Test",
        last_name="User",
        role="seller",
    )


@pytest.fixture
def customer_user(django_user_model):
    return django_user_model.objects.create_user(
        email="customer@example.com",
        password="CustomerUser@123",
        first_name="Test",
        last_name="User",
        role="customer",
    )


@pytest.fixture
def product(seller_account, category):
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
    from .models import Category

    return Category.objects.create(name="Electronics")


# CRUD TESTS
# --------------------


@pytest.mark.django_db
def test_seller_can_create_product(
    api_client, seller_user, seller_account, category
):
    api_client.force_authenticate(user=seller_user)
    url = reverse("product-list")
    # Create a simple 1x1 px image using Pillow
    image_io = BytesIO()
    image = Image.new("RGB", (1, 1), color="white")
    image.save(image_io, format="PNG")
    image_io.seek(0)
    image_file = SimpleUploadedFile(
        "test_image.png", image_io.read(), content_type="image/png"
    )
    data = {
        "title": "New Product",
        "description": "Cool gadget",
        "price": 150.0,
        "stock_quantity": 5,
        "is_active": True,
        "category": category.id,
        "image": image_file,
    }
    response = api_client.post(url, data, format="multipart")
    assert response.status_code == status.HTTP_201_CREATED
    assert Product.objects.count() == 1
    assert Product.objects.first().title == "New Product"


@pytest.mark.django_db
def test_seller_can_update_product(api_client, seller_user, product):
    api_client.force_authenticate(user=seller_user)
    url = reverse("product-detail", args=[product.id])
    data = {"title": "Updated Title"}
    response = api_client.patch(url, data, format="multipart")
    assert response.status_code == status.HTTP_200_OK
    product.refresh_from_db()
    assert product.title == "Updated Title"


@pytest.mark.django_db
def test_seller_can_delete_product(api_client, seller_user, product):
    api_client.force_authenticate(user=seller_user)
    url = reverse("product-detail", args=[product.id])
    response = api_client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert Product.objects.count() == 0


# ACCESS CONTROL TESTS
# --------------------


@pytest.mark.django_db
def test_customer_cannot_create_product(api_client, customer_user, category):
    api_client.force_authenticate(user=customer_user)
    url = reverse("product-list")
    data = {
        "title": "Not Allowed",
        "description": "Should fail",
        "price": 50.0,
        "stock_quantity": 1,
        "is_active": True,
        "category": category.id,
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_customer_cannot_update_product(api_client, customer_user, product):
    api_client.force_authenticate(user=customer_user)
    url = reverse("product-detail", args=[product.id])
    data = {"title": "Hack Attempt"}
    response = api_client.patch(url, data, format="json")
    assert response.status_code == status.HTTP_403_FORBIDDEN


# FILTERING & SEARCH
# --------------------


@pytest.mark.django_db
def test_filter_by_category(api_client, product):
    url = reverse("product-list") + f"?category={product.category.name}"
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data["results"]) == 1
    assert response.data["results"][0]["category"] == product.category.id


@pytest.mark.django_db
def test_search_by_title(api_client, product):
    url = reverse("product-list") + "?search=Test"
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert any("Test" in p["title"] for p in response.data["results"])


# PAGINATION
# --------------------


@pytest.mark.django_db
def test_pagination_metadata(api_client, product):
    url = reverse("product-list") + "?page=1&page_size=1"
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert "total_items" in response.data
    assert "total_pages" in response.data
    assert "current_page" in response.data
    assert len(response.data["results"]) == 1


@pytest.mark.django_db
def test_pagination_out_of_range(api_client, product):
    url = reverse("product-list") + "?page=9999"
    response = api_client.get(url)
    assert response.status_code == status.HTTP_404_NOT_FOUND
