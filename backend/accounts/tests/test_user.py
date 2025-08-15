import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


@pytest.mark.django_db
class TestUserMeEndpoint:

    @pytest.fixture
    def user(self, django_user_model):
        return django_user_model.objects.create_user(
            email="emara@gmail.com",
            password="emara1A_morgan",
            first_name="Abdelrahman",
            last_name="Emara",
            phone_number="01234567890",
            role="customer",
        )

    @pytest.fixture
    def auth_client(self, client, user):
        """Return an API client authenticated as `user`"""
        refresh = RefreshToken.for_user(user)
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        return client

    def test_get_user_info(self, auth_client, user):
        url = reverse("user-me")
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["email"] == user.email
        assert response.data["first_name"] == user.first_name

    def test_patch_user_info(self, auth_client, user):
        url = reverse("user-me")
        payload = {"last_name": "A Emara", "phone_number": "01223456789"}
        response = auth_client.patch(url, payload)
        assert response.status_code == status.HTTP_200_OK
        user.refresh_from_db()
        assert user.last_name == "A Emara"
        assert user.phone_number == "01223456789"

    def test_patch_user_email_unique(
        self, auth_client, user, django_user_model
    ):
        django_user_model.objects.create_user(
            email="aramadan@gmail.com",
            password="anotherPassword12%",
            first_name="Ahmed",
            last_name="Ramadan",
            role="seller",
        )

        url = reverse("user-me")
        payload = {"email": "aramadan@gmail.com"}
        response = auth_client.patch(url, payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data

    def test_unauthenticated_access_denied(self, client):
        url = reverse("user-me")
        response = client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
