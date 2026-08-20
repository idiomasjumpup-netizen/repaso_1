from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from bson.errors import InvalidId

from .mongo import customers_collection, inspection_reports_collection
from .mongo_serializers import CustomerSerializer, InspectionReportSerializer


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
def customers_list_create(request):
    if request.method == "GET":
        docs = [fix_id(d) for d in customers_collection.find().sort("created_at", -1)]
        return Response(docs)

    serializer = CustomerSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    data = serializer.validated_data
    if "created_at" not in data or not data["created_at"]:
        data["created_at"] = datetime.now()

    res = customers_collection.insert_one(data)
    doc = customers_collection.find_one({"_id": res.inserted_id})
    return Response(fix_id(doc), status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([AllowAny])
def customers_detail(request, id: str):
    _id = oid_or_none(id)
    if _id is None:
        return Response({"detail": "ID inválido"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        doc = customers_collection.find_one({"_id": _id})
        if not doc:
            return Response({"detail": "Cliente no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        return Response(fix_id(doc))

    if request.method == "PUT":
        serializer = CustomerSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        customers_collection.update_one({"_id": _id}, {"$set": serializer.validated_data})
        doc = customers_collection.find_one({"_id": _id})
        return Response(fix_id(doc))

    res = customers_collection.delete_one({"_id": _id})
    if res.deleted_count == 0:
        return Response({"detail": "Cliente no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def inspection_reports_list_create(request):
    if request.method == "GET":
        query = {}
        reservation_id = request.query_params.get("reservation_id")
        if reservation_id:
            try:
                query["reservation_id"] = int(reservation_id)
            except ValueError:
                pass

        docs = [fix_id(d) for d in inspection_reports_collection.find(query).sort("created_at", -1)]
        return Response(docs)

    serializer = InspectionReportSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    data = serializer.validated_data
    if "created_at" not in data or not data["created_at"]:
        data["created_at"] = datetime.now()

    res = inspection_reports_collection.insert_one(data)
    doc = inspection_reports_collection.find_one({"_id": res.inserted_id})
    return Response(fix_id(doc), status=status.HTTP_201_CREATED)


@api_view(["GET", "DELETE"])
@permission_classes([AllowAny])
def inspection_reports_detail(request, id: str):
    _id = oid_or_none(id)
    if _id is None:
        return Response({"detail": "ID inválido"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        doc = inspection_reports_collection.find_one({"_id": _id})
        if not doc:
            return Response({"detail": "Acta de inspección no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        return Response(fix_id(doc))

    res = inspection_reports_collection.delete_one({"_id": _id})
    if res.deleted_count == 0:
        return Response({"detail": "Acta de inspección no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_204_NO_CONTENT)
