from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response


class HTMLTemplateView(APIView):
    permission_classes = (AllowAny, )
    renderer_classes = (TemplateHTMLRenderer, )

    @staticmethod
    def get(request):
        return Response()


class IndexView(HTMLTemplateView):
    template_name = 'index.html'


class JoinView(HTMLTemplateView):
    template_name = 'join.html'


class LoginView(HTMLTemplateView):
    template_name = 'login.html'


class FeatureView(HTMLTemplateView):
    template_name = 'features.html'

class Four04View(HTMLTemplateView):
    template_name = '404.html'


