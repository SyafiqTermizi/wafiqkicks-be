from .base import *  # noqa

DEBUG = False
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

# STORAGES
# ------------------------------------------------------------------------------

# https://django-storages.readthedocs.io/en/latest/backends/amazon-S3.html#settings
AWS_ACCESS_KEY_ID = os.environ.get("AWS_S3_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_S3_SECRET_ACCESS_KEY")

AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_S3_STORAGE_BUCKET_NAME")

AWS_QUERYSTRING_AUTH = False

_AWS_EXPIRY = 60 * 60 * 24 * 7
AWS_S3_OBJECT_PARAMETERS = {
    "CacheControl": f"max-age={_AWS_EXPIRY}, s-maxage={_AWS_EXPIRY}, must-revalidate"
}

AWS_S3_REGION_NAME = os.environ.get("AWS_S3_REGION_NAME")

STATICFILES_STORAGE = "storages.backends.s3boto3.S3StaticStorage"


STATIC_URL = f"https://{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/static/"
