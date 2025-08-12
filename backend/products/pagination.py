from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
import math

class ProductPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    def get_paginated_response(self, data):
        total_pages = math.ceil(self.page.paginator.count / self.page.paginator.per_page)
        return Response({
            'total_items': self.page.paginator.count,
            'total_pages': total_pages,
            'current_page': self.page.number,
            'results': data
        })