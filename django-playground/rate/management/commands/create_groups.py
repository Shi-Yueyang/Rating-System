from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group

class Command(BaseCommand):
    help = 'Create groups'
    
    def handle(self, *args, **options):
        group_names = ['Expert','Organizer']
        for group in group_names:
            if not Group.objects.filter(name=group).exists():
                Group.objects.create(name=group)
                self.stdout.write(self.style.SUCCESS(f'Group {group} created'))
            else:
                self.stdout.write(self.style.WARNING(f'Group {group} already exists'))
        self.stdout.write(self.style.SUCCESS("Groups setup completed."))

            
            