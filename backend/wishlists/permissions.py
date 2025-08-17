from rest_framework.permissions import BasePermission
from accounts.models import Roles


class IsAuthenticatedCustomer(BasePermission):
    # Allows access only to authenticated users with the role 'customer'.

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == Roles.CUSTOMER
        )
