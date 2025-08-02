from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from django.db import models


def checkEmail(email):
    if not email:
        raise ValueError('Email must be set')
      

def checkPassword(password):
    if not password:
        raise ValueError("Password must be set")


def checkSuperUser(extra_fields):
    if extra_fields.get('is_staff') is not True:
        raise ValueError('Superuser must have is_staff=True.')
    if extra_fields.get('is_superuser') is not True:
        raise ValueError('Superuser must have is_superuser=True.')
    

class CustomUserManager(BaseUserManager):
    
    def create_user(self, email, password, **extra_fields):
        checkEmail(email)
        checkPassword(password)

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        checkEmail(email)
        checkPassword(password)
        
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        checkSuperUser(extra_fields= extra_fields)
   
        return self.create_user(email, password, **extra_fields)


class Roles(models.TextChoices):
    CUSTOMER = 'customer', 'Customer'
    SELLER = 'seller', 'Seller'
    SHIPPING_COMPANY = 'shipping_company', 'Shipping Company'


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=Roles.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Required for admin access

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name','last_name','role']

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    default_shipping_address = models.ForeignKey(
        'addresses.Address',
        on_delete=models.SET_NULL,
        null=True, 
        blank=True,
        related_name='customer_default_address'
    )
    loyalty_points = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Status(models.TextChoices):
    PENDING = 'pending', 'Pending'
    ACTIVE = 'active', 'Active'
    SUSPENDED = 'suspended', 'Suspended'


class SellerAccount(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    business_license = models.CharField(max_length=50)
    tax_id = models.CharField(max_length=100)
    verified = models.BooleanField(default=False)
    account_status = models.CharField(max_length=20, choices=Status.choices, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ShippingCompany(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    company_person = models.CharField(max_length=255)
    contract_signed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Product(models.Model):
    seller = models.ForeignKey(SellerAccount, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to='products/')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)  #uncomment when Category model is defined

    def __str__(self):
        return self.title