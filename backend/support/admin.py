from django.contrib import admin
from .models import SupportTicket, TicketMessage


class TicketMessageInline(admin.TabularInline):
    model = TicketMessage
    extra = 1
    readonly_fields = ("created_at",)
    fields = ("sender", "message", "created_at")

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for obj in instances:
            if not obj.sender_id:  # set sender only if empty
                obj.sender = request.user
            obj.save()
        formset.save_m2m()


@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "subject",
        "status",
        "customer",
        "created_at",
        "updated_at",
    )
    list_filter = ("status", "created_at")
    search_fields = ("subject", "description")
    inlines = [TicketMessageInline]
    list_display_links = ("id", "subject")
    ordering = ("-created_at",)


@admin.register(TicketMessage)
class TicketMessageAdmin(admin.ModelAdmin):
    list_display = ("id", "ticket", "sender", "created_at")
    search_fields = ("message",)
    readonly_fields = ("created_at",)

    def save_model(self, request, obj, form, change):
        if not obj.sender_id:
            obj.sender = request.user
        super().save_model(request, obj, form, change)
