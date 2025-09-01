"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Staff
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

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

    body = request.json  # request.json gives body in dictionary format
    print(body)

    user = User(email=body["email"], password=body["password"],
                phone=body["phone"], fname=body["first"], lname=body["last"])
    db.session.add(user)
    db.session.commit()

    record_exists = User.query.filter_by(email=body["email"])
    if record_exists:
        return "recieved", 200
    else:
        return "Error, user could not be created", 500


@api.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # Query your database for email and password
    user = User.query.filter_by(email=email, password=password).first()

    if user is None:
        # The user was not found on the database
        return jsonify({"msg": "Bad email or password"}), 401

    # Create a new token with the user id inside
    # Temporarily changed (identity=user.email) to (identity=user.id)
    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token, "user_id": user.id})

# Get currently logged in user (Protected)
#@api.route("/me", methods=["GET"])
# @jwt_required(optional=True)
#def me():
#    user_id = get_jwt_identity()
#    user = User.query.get(user_id)
#    if not user:
#        return jsonify({"msg": "User not found"}), 404

#    return jsonify({
#        "id": user.id,
#        "first": user.fname,
#        "email": user.email
#    })

@api.route("/me/<int:user_id>", methods=["GET"])
def me(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "first": user.fname,
        "last": user.lname,
        "email": user.email,
        "phone": user.phone,
    })


@api.route("/admins", methods=["GET"])
def get_admins():
    admins = User.query.filter(User.roles.contains(["Admin"])).all()
    if not admins:
        return jsonify({"msg": "No admins found"}), 404

    return jsonify([
        {
            "id": admin.id,
            "first": admin.fname,
            "last": admin.lname,
            "email": admin.email,
            "phone": admin.phone,
            "roles": admin.roles
        }
        for admin in admins
    ])

@api.route("/customers", methods=["GET"])
def get_customers():
    customers = User.query.filter(User.roles.contains(["Customer"])).all()
    if not customers:
        return jsonify({"msg": "No customers found"}), 404

    return jsonify([
        {
            "id": customer.id,
            "first": customer.fname,
            "last": customer.lname,
            "email": customer.email,
            "phone": customer.phone,
            "roles": customer.roles
        }
        for customer in customers
    ])

@api.route("/user/<int:user_id>/role", methods=["PUT"])
def update_user_roles(user_id):
    data = request.get_json()  # parse JSON from body
    new_roles = data.get("roles")  # expecting { "roles": ["Admin", "Customer"] }

    if not new_roles or not isinstance(new_roles, list):
        return jsonify({"msg": "Invalid roles format"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # update roles field (assuming it's an ARRAY column)
    user.roles = new_roles  

    db.session.commit()

    return jsonify({
        "id": user.id,
        "first": user.fname,
        "last": user.lname,
        "email": user.email,
        "phone": user.phone,
        "roles": user.roles
    }), 200

@api.route("/user/<int:user_id>", methods=["PUT"])
def update_user_info(user_id):
    data = request.get_json()

    first = data.get("first")
    last = data.get("last")
    phone = data.get("phone")
    email = data.get("email")

    if not all ([first, last, phone, email]):
        return jsonify({"msg": "Error: All fields required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    user.fname = first
    user.lname = last
    user.phone = phone
    user.email = email

    db.session.commit()

    return jsonify({
        "id": user.id,
        "first": user.fname,
        "last": user.lname,
        "email": user.email,
        "phone": user.phone,
        "roles": user.roles
    }), 200

@api.route('/staff', methods=['GET'])
def get_staff():
    staff = Staff.query.all()
    return jsonify([s.serialize() for s in staff]), 200

@api.route('/staff', methods=['POST'])
def add_staff():
    data = request.get_json()

    # Validate required fields
    if not data.get("name") or not data.get("role"):
        return jsonify({"error": "Name and role are required"}), 400

    new_staff = Staff(
        name=data.get("name"),
        role=data.get("role"),
        bio=data.get("bio", ""),
        photo_url=data.get("photoUrl", ""),
        booking_url=data.get("bookingUrl", "#")
    )

    db.session.add(new_staff)
    db.session.commit()

    return jsonify(new_staff.serialize()), 201 