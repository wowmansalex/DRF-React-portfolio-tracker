from django.contrib.auth.base_user import BaseUserManager

from django.utils.translation import gettext_lazy as _

class CustomUser(BaseUserManager):
  """
  custom user where email is unique identifier instead of username.
  """
  def create_user(self, email, password, **extra_fields):
    # create a user with the given email and password
    if not email:
      raise ValueError(_('The email field is required'))
    email = self.normalize_email(email)
    user = self.model(email=email, **extra_fields)
    user.set_password(password)
    user.save()
    return user
  
  def create_superuser(self, email, password, **extra_fields):
      # create a superuser with the given email and password
      extra_fields.setdefault('is_staff', True)
      extra_fields.setdefault('is_superuser', True)
      extra_fields.setdefault('is_active', True)

      if extra_fields.get('is_staff') is not True:
        raise ValueError(_('is_staff must be True'))
      if extra_fields.get('is_superuser') is not True:
        raise ValueError(_('Superuser must have is_super set to true'))
      return self.create_user(email, password, **extra_fields)

      
