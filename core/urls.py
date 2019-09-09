from django.urls import path
from .views import IndexView, LoginView, JoinView, FeatureView, Four04View


urlpatterns = [
    path('', IndexView.as_view()),
    path('login', LoginView.as_view()),
    path('join', JoinView.as_view()),
    path('features', FeatureView.as_view()),
    path('404', Four04View.as_view()),
]
