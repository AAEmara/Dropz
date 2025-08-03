from rest_framework.routers import DefaultRouter
from .views import AddressViewSet

router = DefaultRouter()
router.register('addresses', AddressViewSet, basename='addresses')

urlpatterns = router.urls