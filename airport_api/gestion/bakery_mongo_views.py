from datetime import datetime, timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from bson.errors import InvalidId

from .mongo import suppliers_collection, baking_sheets_collection
from .mongo_serializers import SupplierSerializer, BakingSheetSerializer


def fix_id(doc):
    if not doc:
        return doc
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc


def oid_or_none(id_str: str):
    try:
        return ObjectId(id_str)
    except InvalidId:
        return None


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def suppliers_list_create(request):
    if request.method == "GET":
        docs = [fix_id(d) for d in suppliers_collection.find().sort("created_at", -1)]
        return Response(docs)

    serializer = SupplierSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    data = serializer.validated_data
    if "created_at" not in data or not data["created_at"]:
        data["created_at"] = datetime.now()

    res = suppliers_collection.insert_one(data)
    doc = suppliers_collection.find_one({"_id": res.inserted_id})
    return Response(fix_id(doc), status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([AllowAny])
def suppliers_detail(request, id: str):
    _id = oid_or_none(id)
    if _id is None:
        return Response({"detail": "ID inválido"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        doc = suppliers_collection.find_one({"_id": _id})
        if not doc:
            return Response({"detail": "Proveedor no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        return Response(fix_id(doc))

    if request.method == "PUT":
        serializer = SupplierSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        suppliers_collection.update_one({"_id": _id}, {"$set": serializer.validated_data})
        doc = suppliers_collection.find_one({"_id": _id})
        return Response(fix_id(doc))

    res = suppliers_collection.delete_one({"_id": _id})
    if res.deleted_count == 0:
        return Response({"detail": "Proveedor no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def baking_sheets_list_create(request):
    if request.method == "GET":
        query = {}
        order_id = request.query_params.get("order_id")
        if order_id:
            try:
                query["order_id"] = int(order_id)
            except ValueError:
                pass

        docs = [fix_id(d) for d in baking_sheets_collection.find(query).sort("created_at", -1)]
        return Response(docs)

    serializer = BakingSheetSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    data = serializer.validated_data
    now = datetime.now()
    if "created_at" not in data or not data["created_at"]:
        data["created_at"] = now
    if "estimated_ready_at" not in data or not data["estimated_ready_at"]:
        data["estimated_ready_at"] = now + timedelta(minutes=30)

    res = baking_sheets_collection.insert_one(data)
    doc = baking_sheets_collection.find_one({"_id": res.inserted_id})
    return Response(fix_id(doc), status=status.HTTP_201_CREATED)


@api_view(["GET", "DELETE"])
@permission_classes([AllowAny])
def baking_sheets_detail(request, id: str):
    _id = oid_or_none(id)
    if _id is None:
        return Response({"detail": "ID inválido"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        doc = baking_sheets_collection.find_one({"_id": _id})
        if not doc:
            return Response({"detail": "Hoja de horneado no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        return Response(fix_id(doc))

    res = baking_sheets_collection.delete_one({"_id": _id})
    if res.deleted_count == 0:
        return Response({"detail": "Hoja de horneado no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_204_NO_CONTENT)
