from django.db.models.aggregates import Avg
from graphene.types.scalars import Int
from graphene_django import DjangoObjectType
import graphene
from diseases.models import UserModel, Symptom, Association
from django.db.models import Value, FloatField, Case, When, F, Func, Avg



class UserType(DjangoObjectType):
    class Meta:
        model = UserModel


class SymptomType(DjangoObjectType):
    class Meta:
        model = Symptom


class Query(graphene.ObjectType):
    symptoms = graphene.List(SymptomType)
    diseases_by_symptoms = graphene.List(graphene.String, ids=graphene.List(Int))

    def resolve_symptoms(self, info):
        return Symptom.objects.all()
    
    def resolve_diseases_by_symptoms(root, info, ids):
        # calculating likelihood of each symptom for each disease
        all_diseases = Association.objects.filter(Symptom_id__in=ids).values_list('Disease')
        disease_candidates = Association.objects \
            .filter(Disease__in=all_diseases) \
            .annotate(
              has_symptom=Case(
                  When(Symptom_id__in=ids, then=Value(1)),
                  default=Value(0), 
                  output_field=FloatField()
               )
            ) \
            .annotate(likelihood = 1 - Func(F('has_symptom') - F('Frequency'), 
                function='ABS')) \
            .values_list('Disease').annotate(avg_likelihood = Avg('likelihood')) \
            .values('Disease').filter(avg_likelihood__gte = 0.55) \
            .values_list('Disease', flat=True)
        print(disease_candidates)
        return disease_candidates



schema = graphene.Schema(
    query=Query,
)
