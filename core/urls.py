from django.urls import path
from .views import IndexView, LoginView, JoinView


urlpatterns = [
    path('', IndexView.as_view()),
    path('login', LoginView.as_view()),
    path('join', JoinView.as_view()),
]
