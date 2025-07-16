from rest_framework import serializers
from .models import (
    Delivery, TransportModel, PackageType, Service,
    DeliveryStatus, CargoType
)
from datetime import date


class TransportModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportModel
        fields = ['id', 'name']


class PackageTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageType
        fields = ['id', 'name']


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name']


class DeliveryStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryStatus
        fields = ['id', 'name']


class CargoTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CargoType
        fields = ['id', 'name']


class DeliverySerializer(serializers.ModelSerializer):
    transport_model = TransportModelSerializer()
    package_type = PackageTypeSerializer()
    service = ServiceSerializer()
    status = DeliveryStatusSerializer()
    cargo_type = CargoTypeSerializer()

    class Meta:
        model = Delivery
        fields = [
            'id', 'date', 'transport_number', 'transport_model',
            'package_type', 'service', 'status', 'cargo_type',
            'distance_km'
        ]

    def validate_distance_km(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                'Дистанция должна быть больше 0 км.'
            )
        return value

    def validate_date(self, value):
        if value > date.today():
            raise serializers.ValidationError(
                'Дата не может быть в будущем.'
            )
        return value

    def validate_transport_number(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                'Номер транспорта не может быть пустым.'
            )
        return value