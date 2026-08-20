from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, OrderViewSet
from .bakery_mongo_views import (
    suppliers_list_create,
    suppliers_detail,
    baking_sheets_list_create,
    baking_sheets_detail,
)

router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="products")
router.register(r"orders", OrderViewSet, basename="orders")

urlpatterns = [
    # Mongo endpoints
    path("suppliers/", suppliers_list_create, name="suppliers-list-create"),
    path("suppliers/<str:id>/", suppliers_detail, name="suppliers-detail"),
    path("baking-sheets/", baking_sheets_list_create, name="baking-sheets-list-create"),
    path("baking-sheets/<str:id>/", baking_sheets_detail, name="baking-sheets-detail"),
]

urlpatterns += router.urls