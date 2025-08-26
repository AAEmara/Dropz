import requests

# import json
# from decimal import Decimal
from django.conf import settings
from rest_framework import status
from rest_framework.exceptions import APIException


class PaymobError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Paymob service error"


class PaymobService:
    BASE_URL = settings.PAYMOB.get("BASE_URL", "https://accept.paymob.com/api")

    @classmethod
    def authenticate(cls):
        try:
            api_key = settings.PAYMOB.get("API_KEY")
            if not api_key:
                raise PaymobError("Paymob API_KEY is not configured")

            url = f"{cls.BASE_URL}/auth/tokens"
            payload = {"api_key": api_key}
            res = requests.post(url, json=payload, timeout=10)

            if res.status_code != 201:
                raise PaymobError(
                    f"Paymob auth failed: {res.status_code} - {res.text}"
                )

            return res.json()["token"]

        except requests.exceptions.RequestException as e:
            raise PaymobError(f"Network error: {str(e)}")
        except KeyError:
            raise PaymobError("Invalid response from Paymob")
        except Exception as e:
            raise PaymobError(f"Unexpected error: {str(e)}")

    @classmethod
    def create_order(cls, token, payment):
        url = f"{cls.BASE_URL}/ecommerce/orders"

        # Convert amount_cents to integer (in case it's Decimal)
        amount_cents = int(payment.amount_cents)

        payload = {
            "auth_token": token,
            "delivery_needed": False,
            "amount_cents": amount_cents,  # Use converted integer
            "currency": "EGP",
            "merchant_order_id": str(payment.id),  # Ensure string
            "items": [],
        }

        res = requests.post(url, json=payload)
        res.raise_for_status()
        return res.json()

    @classmethod
    def generate_payment_key(cls, token, payment, billing_data):
        url = f"{cls.BASE_URL}/acceptance/payment_keys"

        # Convert amount_cents to integer
        amount_cents = int(payment.amount_cents)

        payload = {
            "auth_token": token,
            "amount_cents": amount_cents,  # Use converted integer
            "expiration": 3600,
            "order_id": payment.paymob_order_id,
            "billing_data": billing_data,
            "currency": "EGP",
            "integration_id": settings.PAYMOB["INTEGRATION_ID_CARD"],
        }

        res = requests.post(url, json=payload)
        res.raise_for_status()
        return res.json()
