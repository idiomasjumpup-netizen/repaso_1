from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Gate, Flight
from .serializers import GateSerializer, FlightSerializer
from .permissions import IsAdminOrReadOnly

class GateViewSet(viewsets.ModelViewSet):
    queryset = Gate.objects.all().order_by("id")
    serializer_class = GateSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["code"]
    ordering_fields = ["id", "code", "terminal"]

class FlightViewSet(viewsets.ModelViewSet):
    queryset = Flight.objects.select_related("gate").all().order_by("-id")
    serializer_class = FlightSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["gate"]
    search_fields = ["flight_number", "destination", "status", "gate__nombre"]
    ordering_fields = ["id", "flight_number", "destination", "status", "created_at"]


    def get_permissions(self):
        # Público: SOLO listar vehículos
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()