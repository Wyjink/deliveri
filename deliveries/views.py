from django.shortcuts import render
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Delivery
from .serializers import DeliverySerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count
from django.utils.dateparse import parse_date



class DeliveryListView(generics.ListAPIView):
    queryset = Delivery.objects.all().select_related(
        'transport_model', 'package_type', 'service', 'status', 'cargo_type'
    )
    serializer_class = DeliverySerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['service', 'cargo_type', 'date']
    ordering_fields = ['date']
    permission_classes = [permissions.IsAuthenticated]

class DeliveryStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        qs = Delivery.objects.all()
        if date_from:
            qs = qs.filter(date__gte=parse_date(date_from))
        if date_to:
            qs = qs.filter(date__lte=parse_date(date_to))
        stats = (
            qs.values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )
        return Response(stats)
