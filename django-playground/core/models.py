from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/',null=True,blank=True)

    def save(self,*args,**kwargs):
        if not self.password.startswith("pbkdf2_"):
            print('aaa')
            self.set_password(self.password)

        if self.pk:
            old_user = CustomUser.objects.get(pk=self.pk)
            if old_user.avatar and old_user.avatar != self.avatar:
                old_user.avatar.delete(save=False);


        super().save(*args,**kwargs)
