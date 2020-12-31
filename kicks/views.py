from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Kick


class KickCountUpView(APIView):

    def post(self, request, *args, **kwargs):
        Kick.objects.create()
        return Response(status=201)        
