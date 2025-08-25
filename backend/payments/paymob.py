import requests
from django.conf import settings


class PaymobService:
    BASE_URL = settings.PAYMOB["BASE_URL"]

    @classmethod
    def authenticate(cls):
        url = f"{cls.BASE_URL}/auth/tokens"
        payload = {"api_key": settings.PAYMOB["API_KEY"]}
        res = requests.post(url, json=payload)
        res.raise_for_status()
        return res.json()["token"]

    @classmethod
    def create_order(cls, token, payment):
        url = f"{cls.BASE_URL}/ecommerce/orders"
        payload = {
            "auth_token": token,
            "delivery_needed": False,
            "amount_cents": payment.amount_cents,
            "currency": "EGP",
            "merchant_order_id": payment.id,
            "items": [],
        }
        res = requests.post(url, json=payload)
        res.raise_for_status()
        return res.json()

    @classmethod
    def generate_payment_key(cls, token, payment, billing_data):
        url = f"{cls.BASE_URL}/acceptance/payment_keys"
        payload = {
            "auth_token": token,
            "amount_cents": payment.amount_cents,
            "expiration": 3600,
            "order_id": payment.paymob_order_id,
            "billing_data": billing_data,
            "currency": "EGP",
            "integration_id": settings.PAYMOB["INTEGRATION_ID_CARD"],
        }
        res = requests.post(url, json=payload)
        res.raise_for_status()
        return res.json()
