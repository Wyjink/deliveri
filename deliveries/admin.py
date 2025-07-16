from django.contrib import admin
from .models import (
    TransportModel, PackageType, Service, DeliveryStatus, CargoType, Delivery
)

admin.site.register(TransportModel)
admin.site.register(PackageType)
admin.site.register(Service)
admin.site.register(DeliveryStatus)
admin.site.register(CargoType)
admin.site.register(Delivery)
