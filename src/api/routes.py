"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/user', methods=['POST'])
def sign_up():

    body = request.json #request.json gives body in dictionary format
    print(body)

    user = User(email = body["email"], password = body["password"], phone = body["phone"], fname = body["first"], lname = body["last"])
    db.session.add(user)
    db.session.commit()

    record_exists = User.query.filter_by(email = body["email"])
    if record_exists:
        return "recieved", 200
    else:
        return "Error, user could not be created", 500