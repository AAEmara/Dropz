import hashlib
import hmac
from django.conf import settings


def validate_paymob_hmac(obj_data: dict, received_hmac: str) -> bool:
    """
    Validate HMAC signature from Paymob webhook.
    Docs: https://docs.paymob.com/docs/hmac-calculation
    """

    hmac_secret = settings.PAYMOB["HMAC_SECRET"]

    # Concatenate fields in required order
    concatenated = "".join(
        [
            str(obj_data.get("amount_cents", "")),
            str(obj_data.get("created_at", "")),
            str(obj_data.get("currency", "")),
            str(obj_data.get("error_occured", "")),
            str(obj_data.get("has_parent_transaction", "")),
            str(obj_data.get("id", "")),
            str(obj_data.get("integration_id", "")),
            str(obj_data.get("is_3d_secure", "")),
            str(obj_data.get("is_auth", "")),
            str(obj_data.get("is_capture", "")),
            str(obj_data.get("is_refunded", "")),
            str(obj_data.get("is_standalone_payment", "")),
            str(obj_data.get("is_voided", "")),
            str(obj_data.get("order", {}).get("id", "")),
            str(obj_data.get("owner", "")),
            str(obj_data.get("pending", "")),
            str(obj_data.get("source_data", {}).get("pan", "")),
            str(obj_data.get("source_data", {}).get("sub_type", "")),
            str(obj_data.get("source_data", {}).get("type", "")),
            str(obj_data.get("success", "")),
        ]
    )

    computed_hmac = hmac.new(
        hmac_secret.encode(),
        concatenated.encode(),
        hashlib.sha512,
    ).hexdigest()

    return hmac.compare_digest(computed_hmac, received_hmac)
