from rest_framework import serializers

class AirlineSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    code = serializers.CharField(max_length=120, allow_blank=True)
    country = serializers.CharField(max_length=120, allow_blank=True)
    is_active = serializers.BooleanField(default=True)
    created_at = serializers.DateTimeField(required=False)

class FlightEventSerializer(serializers.Serializer):
    flight_id = serializers.IntegerField()        # ID de Vehiculo (Postgres)
    airline_id =  serializers.CharField()
    class EventType:
        CREATED = "creado"
        BOARDING_STARTED = "a_bordo"
        DEPARTED = "despegado"
        DELAYED = "retrasado"
        CANCELLED = "cancelado"

        CHOICES = [
            (CREATED, "Creado"),
            (BOARDING_STARTED, "A bordo"),
            (DEPARTED, "Despegado"),
            (DELAYED, "Retrasado"),
            (CANCELLED, "Cancelado"),
        ]

    event_type = serializers.ChoiceField(
        choices=EventType.CHOICES,  
        default=EventType.CREATED
    )

    class Source:
        WEB = "web"
        MOBILE = "mobile"
        SYSTEM = "sistema"
        
        CHOICES = [
            (WEB, "Web"),
            (MOBILE, "Mobile"),
            (SYSTEM, "Sistema"),
        ]

    source = serializers.ChoiceField(
        choices=Source.CHOICES,  
        default=Source.WEB
    )

    note = serializers.CharField(required=False, allow_blank=True) 
    created_at = serializers.DateTimeField(required=False)