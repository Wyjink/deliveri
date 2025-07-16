from django.db import models

# Create your models here.

class TransportModel(models.Model):
    name = models.CharField(max_length=100, verbose_name="Модель ТС")

    def __str__(self):
        return self.name

class PackageType(models.Model):
    name = models.CharField(max_length=100, verbose_name="Тип упаковки")

    def __str__(self):
        return self.name

class Service(models.Model):
    name = models.CharField(max_length=100, verbose_name="Услуга")

    def __str__(self):
        return self.name

class DeliveryStatus(models.Model):
    name = models.CharField(max_length=100, verbose_name="Статус доставки")

    def __str__(self):
        return self.name

class CargoType(models.Model):
    name = models.CharField(max_length=100, verbose_name="Тип груза")

    def __str__(self):
        return self.name

class Delivery(models.Model):
    date = models.DateField(verbose_name="Дата доставки")
    transport_number = models.CharField(max_length=100, verbose_name="Номер ТС")
    transport_model = models.ForeignKey(TransportModel, on_delete=models.CASCADE, verbose_name="Модель ТС")
    package_type = models.ForeignKey(PackageType, on_delete=models.CASCADE, verbose_name="Тип упаковки")
    service = models.ForeignKey(Service, on_delete=models.CASCADE, verbose_name="Услуга")
    status = models.ForeignKey(DeliveryStatus, on_delete=models.CASCADE, verbose_name="Статус доставки")
    cargo_type = models.ForeignKey(CargoType, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Тип груза")
    distance_km = models.PositiveIntegerField(verbose_name="Дистанция (км)")

    def __str__(self):
        return f"Доставка {self.pk} ({self.date})"
