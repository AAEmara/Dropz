from rest_framework.permissions import BasePermission


def is_support(user):
    return getattr(user, "role", "") == "support_staff" or user.is_staff


class IsSupportStaff(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and is_support(request.user)
        )


class IsTicketOwnerOrSupportStaff(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if is_support(user):
            return True
        if hasattr(obj, "customer_id"):
            return obj.customer_id == user.id
        if hasattr(obj, "ticket") and hasattr(obj.ticket, "customer_id"):
            return obj.ticket.customer_id == user.id
        return False
