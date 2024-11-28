from rest_framework.permissions import BasePermission, SAFE_METHODS



class IsAdminOrOrganizer(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        if request.user.is_authenticated:
            return request.user.groups.filter(name='Organizer').exists()
        return False

        
class IsAdminOrExpert(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.is_staff or request.user.is_superuser:
            return True
        if request.user.groups.filter(name='Expert').exists():
            if request.method in SAFE_METHODS or request.method == 'PATCH':
                return True
        return False