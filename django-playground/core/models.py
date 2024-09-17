from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/',null=True,blank=True)

    def save(self,*args,**kwargs):
        if not self.pk or not self.password.startswith("pbkdf2_"):
            self.set_password(self.password)
        super().save(*args,**kwargs)