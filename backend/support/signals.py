# support/signals.py
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from .models import SupportTicket, TicketMessage


@receiver(post_migrate)
def ensure_support_staff_group(sender, **kwargs):
    # Only run after the 'support' app migrations
    if getattr(sender, "name", None) != "support":
        return

    group, _ = Group.objects.get_or_create(name="Support Staff")

    ct_ticket = ContentType.objects.get_for_model(SupportTicket)
    ct_message = ContentType.objects.get_for_model(TicketMessage)

    # Minimum permissions for support users
    needed = [
        ("view_supportticket", ct_ticket),
        ("change_supportticket", ct_ticket),  # update status
        ("view_ticketmessage", ct_message),
        ("add_ticketmessage", ct_message),  # reply on tickets
    ]

    for codename, ct in needed:
        try:
            perm = Permission.objects.get(content_type=ct, codename=codename)
            group.permissions.add(perm)
        except Permission.DoesNotExist:
            # If you’ve just added models, run makemigrations/migrate again
            pass
