from rest_framework import pagination


class CustomPagination(pagination.PageNumberPagination):
    """
    This class adds pagination to the groups in user profile
    """
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 5
