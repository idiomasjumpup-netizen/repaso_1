from django.db import models


class Gate(models.Model):
    code = models.CharField(max_length=120, unique=True)
    terminal = models.CharField(max_length=120)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} {self.terminal} {self.is_available} {self.created_at} "

class Flight(models.Model):
    gate = models.ForeignKey(Gate, on_delete=models.PROTECT, related_name="flights")
    flight_number = models.CharField(max_length=120)
    destination = models.CharField(max_length=120)
    class Status(models.TextChoices):
        SCHEDULED = "agendado", "Agendado"
        BOARDING = "a_bordo", "A bordo"
        DEPARTED = "despegado", "Despegado"
        DELAYED = "retrasado", "Retrasado"
        CANCELLED = "cancelado", "Cancelado"

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SCHEDULED
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.gate.code} {self.flight_number} {self.destination}{self.status} {self.created_at}"

