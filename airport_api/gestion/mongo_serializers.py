from rest_framework import serializers


class SupplierSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=50, default="Ecuador")
    is_active = serializers.BooleanField(default=True)
    created_at = serializers.DateTimeField(required=False)


class BakingSheetSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    oven_batch = serializers.CharField(max_length=50, default="LOTE-A")
    temperature_c = serializers.IntegerField(default=180)
    estimated_ready_at = serializers.DateTimeField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True, default="Hoja de horneado estándar")
    created_at = serializers.DateTimeField(required=False)