  
import os
from flask_admin import Admin
from .models import db, User, Staff
from flask_admin.contrib.sqla import ModelView


class StaffAdmin(ModelView):
    # nice defaults for the grid + forms
    column_list = ("id", "name", "role", "bio", "booking_url")
    column_searchable_list = ("name", "role", "bio")
    column_filters = ("role",)
    can_view_details = True
    form_columns = ("name", "role", "bio", "photo_url", "booking_url")

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))
    admin.add_view(StaffAdmin(Staff, db.session, endpoint="staff_admin"))