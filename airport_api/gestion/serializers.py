from rest_framework import serializers
from .models import Gate, Flight

class GateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gate
        fields = ["id", "code", "terminal", "is_available", "created_at"]

class FlightSerializer(serializers.ModelSerializer):
    gate_nombre = serializers.CharField(source="gate.code", read_only=True)

    class Meta:
        model = Flight
        fields = ["id", "gate", "gate_nombre", "flight_number", "destination", "status", "created_at"]