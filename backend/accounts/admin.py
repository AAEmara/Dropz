from django.contrib import admin
from .models import User, SellerAccount


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "first_name", "last_name", "role", "is_active")


@admin.register(SellerAccount)
class SellerAccountAdmin(admin.ModelAdmin):
    list_display = ("user", "company_name", "verified", "account_status")
    list_filter = ("verified", "account_status")
    search_fields = ("company_name", "user__email")
