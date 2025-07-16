from django.urls import path
from . import views

urlpatterns = [
    path('', views.DeliveryListView.as_view(),
         name='delivery-list'),
    path('stats/', views.DeliveryStatsView.as_view(),
         name='delivery-stats'),
]