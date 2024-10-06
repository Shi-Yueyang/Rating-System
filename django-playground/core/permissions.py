from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOrganizer(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            return request.user.groups.filter(name='Organizer').exists()
        return False
    
class IsExpert(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in SAFE_METHODS:  # SAFE_METHODS include GET, HEAD, OPTIONS
            return request.user.groups.filter(name='expert').exists()
        elif request.method == 'PATCH':
            return request.user.groups.filter(name='expert').exists()
        return False