from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import (
    RegisterSerializer)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Account created successfully."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



