from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings

from .models import Payment
from .serializers import PaymentSerializer
from .paymob import PaymobService
from .utils import validate_paymob_hmac


class PaymobPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_id):
        from orders.models import Order

        order = get_object_or_404(Order, id=order_id)

        with transaction.atomic():
            # Create payment with method field
            payment = Payment.objects.create(
                order=order,
                amount_cents=order.total_cents,
                method="paymob",  # This now matches your database
            )

            # Step 1: authenticate
            try:
                token = PaymobService.authenticate()
            except Exception as e:
                return Response(
                    {"error": f"Paymob authentication failed: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            # Step 2: create Paymob order
            try:
                order_response = PaymobService.create_order(token, payment)
                payment.paymob_order_id = order_response["id"]
            except Exception as e:
                return Response(
                    {"error": f"Paymob order creation failed: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            # Step 3: billing data
            billing_data = {
                "apartment": "NA",
                "email": request.user.email or "customer@example.com",
                "floor": "NA",
                "first_name": request.user.first_name or "NA",
                "last_name": request.user.last_name or "NA",
                "street": "NA",
                "building": "NA",
                "phone_number": request.user.phone_number or "01000000000",
                "city": "NA",
                "country": "NA",
                "state": "NA",
            }

            # Step 4: generate payment key
            try:
                key_response = PaymobService.generate_payment_key(
                    token, payment, billing_data
                )
                payment.paymob_payment_key = key_response["token"]
            except Exception as e:
                return Response(
                    {"error": f"Payment key generation failed: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            # Save payment updates
            payment.response_payload = {
                "order": order_response,
                "payment_key": key_response,
            }
            payment.save()

        iframe_url = (
            f"https://accept.paymob.com/api/acceptance/iframes/"
            f"{settings.PAYMOB['IFRAME_ID']}?payment_token="
            f"{payment.paymob_payment_key}"
        )

        return Response(
            {
                "iframe_url": iframe_url,
                "payment": PaymentSerializer(payment).data,
            },
            status=status.HTTP_201_CREATED,
        )


@method_decorator(csrf_exempt, name="dispatch")
class PaymobWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        obj = data.get("obj", {})
        received_hmac = request.GET.get("hmac")

        if not received_hmac or not validate_paymob_hmac(obj, received_hmac):
            return Response(
                {"detail": "Invalid HMAC"}, status=status.HTTP_400_BAD_REQUEST
            )

        transaction_id = obj.get("id")
        success = obj.get("success")

        # Update payment
        payment, _ = Payment.objects.get_or_create(
            paymob_transaction_id=transaction_id,
            defaults={
                "amount_cents": int(obj.get("amount_cents", 0)),
                "status": "success" if success else "failed",
                "response_payload": data,
            },
        )

        if not _:
            # Already exists, just update
            payment.status = "success" if success else "failed"
            payment.response_payload = data
            payment.save()

        return Response({"status": payment.status}, status=status.HTTP_200_OK)
