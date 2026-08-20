from django.conf import settings
from pymongo import MongoClient

_client = MongoClient(settings.MONGO_URI)
db = _client[settings.MONGO_DB]

suppliers_collection = db["suppliers"]
baking_sheets_collection = db["baking_sheets"]