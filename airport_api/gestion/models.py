from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length=20)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "products"

    def __str__(self):
        return f"{self.name} ({self.category})"


class Order(models.Model):
    class Status(models.TextChoices):
        RECEIVED = "RECEIVED", "Received"
        BAKING = "BAKING", "Baking"
        READY = "READY", "Ready"
        DELIVERED = "DELIVERED", "Delivered"
        CANCELLED = "CANCELLED", "Cancelled"

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="orders",
        db_column="product_id"
    )
    customer_name = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.RECEIVED
    )
    order_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "orders"

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name} ({self.status})"
