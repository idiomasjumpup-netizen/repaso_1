from datetime import datetime, timedelta
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Product, Order
from .serializers import ProductSerializer, OrderSerializer
from .mongo import baking_sheets_collection


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("-id")
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["category", "is_available"]
    search_fields = ["name", "category"]
    ordering_fields = ["id", "name", "category", "created_at"]


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related("product").all().order_by("-id")
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "product"]
    search_fields = ["customer_name", "status", "product__name"]
    ordering_fields = ["id", "status", "order_time", "created_at"]

    def perform_create(self, serializer):
        # 1. Guardar el pedido en PostgreSQL
        order = serializer.save()

        # 2. Generar automáticamente la hoja de horneado en MongoDB
        now = datetime.now()
        oven_batch = self.request.data.get("oven_batch", "LOTE-A")
        temperature_c = int(self.request.data.get("temperature_c", 180))
        notes = self.request.data.get(
            "notes", f"Hoja de horneado para pedido #{order.id} ({order.customer_name})"
        )

        baking_sheet_doc = {
            "order_id": order.id,
            "oven_batch": oven_batch,
            "temperature_c": temperature_c,
            "estimated_ready_at": now + timedelta(minutes=30),
            "notes": notes,
            "created_at": now,
        }
        baking_sheets_collection.insert_one(baking_sheet_doc)