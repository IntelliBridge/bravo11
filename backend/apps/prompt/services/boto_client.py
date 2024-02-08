import boto3
from django.conf import settings

def get_bedrock_client():
    print(settings.AWS_ACCESS_KEY, settings.SECRET_KEY)
    return boto3.client(
        'bedrock-runtime',
        aws_access_key_id=settings.AWS_ACCESS_KEY,
        aws_secret_access_key=settings.AWS_SECRET_KEY,
        region_name='us-east-1'
    )
