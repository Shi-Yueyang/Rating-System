# core/signals.py
from django.db.backends.signals import connection_created
from django.dispatch import receiver

@receiver(connection_created)
def set_sqlite_pragma(sender, connection, **kwargs):
    if connection.vendor == 'sqlite':
        cursor = connection.cursor()
        print('Setting WAL mode')
        cursor.execute('PRAGMA journal_mode=WAL;')