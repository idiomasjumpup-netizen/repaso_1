from rest_framework import serializers
from django.utils import timezone
from .models import Product, Order


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "category", "is_available", "created_at"]


class OrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_category = serializers.CharField(source="product.category", read_only=True)
    order_time = serializers.DateTimeField(required=False, default=timezone.now)

    class Meta:
        model = Order
        fields = [
            "id",
            "product",
            "product_name",
            "product_category",
            "customer_name",
            "status",
            "order_time",
            "created_at",
        ]