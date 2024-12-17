from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/',null=True,blank=True)
    realname = models.CharField(max_length=100, null=True, blank=True,default="未命名用户")
    cat = models.CharField(max_length=100, null=True, blank=True,default="no cat")
    def save(self,*args,**kwargs):
        if not self.password.startswith("pbkdf2_"):
            self.set_password(self.password)

        if self.pk:
            old_user = CustomUser.objects.get(pk=self.pk)
            if old_user.avatar and old_user.avatar != self.avatar:
                old_user.avatar.delete(save=False);


        super().save(*args,**kwargs)
