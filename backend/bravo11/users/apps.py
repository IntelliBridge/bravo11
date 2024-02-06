from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class UsersConfig(AppConfig):
    name = "bravo11.users"
    verbose_name = _("Users")

    def ready(self):
        try:
            import bravo11.users.signals  # noqa: F401
        except ImportError:
            pass
