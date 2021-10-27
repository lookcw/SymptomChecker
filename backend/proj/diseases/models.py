from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class UserModel(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

class Symptom(models.Model):
    name = models.CharField(max_length=200)

class Association(models.Model):
    Symptom = models.ForeignKey(Symptom, models.DO_NOTHING, blank=True, null=True)
    Disease = models.CharField(max_length=100)
    Frequency = models.FloatField(default=0)
    
    