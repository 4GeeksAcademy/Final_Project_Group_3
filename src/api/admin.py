import os
import json
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from markupsafe import Markup
from .models import db, User, Appointment
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

# ---------- Users ----------
class UserAdmin(ModelView):
    # nice defaults for the grid + forms
    column_list = ("id", "fname", "lname", "email", "role", "phone", "bio", "photo_url", "booking_url")
    column_searchable_list = ("fname", "lname", "role", "email")
    column_filters = ("role",)
    can_view_details = True

    form_columns = ("fname", "lname", "email", "password", "phone", "role", "bio", "photo_url", "booking_url")


# ---------- Appointments ----------
def _service_names(view, context, model, name):
    data = getattr(model, name) or []
    try:
        if isinstance(data, str):
            data = json.loads(data or "[]")
        names = [s.get("name") for s in data if isinstance(s, dict) and s.get("name")]
    except Exception:
        names = []

    return ", ".join(names) or "—"

def _fmt_starts_at(view, context, model, name):
    val = getattr(model, name)
    if not val:
        return "—"

    if isinstance(val, str):
        try:
            val = datetime.fromisoformat(val.replace("Z", "+00:00"))
        except Exception:
            return val 

    try:
        if getattr(val, "tzinfo", None) is not None:
            val = val.astimezone()
    except Exception:
        pass

    return val.strftime("%b %d, %Y %I:%M %p")

LOCAL_TZ = ZoneInfo(os.getenv("LOCAL_TZ", "America/New_York"))

def _fmt_starts_at(view, context, model, name):
    val = getattr(model, name)
    if not val:
        return "-"
    dt = val
    # ensure aware
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    local = dt.astimezone(LOCAL_TZ)
    return local.strftime("%b %d, %Y %I:%M %p")

class AppointmentAdmin(ModelView):
    column_list = (
        "id", "starts_at", "staff_id", "customer_id", "duration_min",
        "subtotal", "tip", "total", "services", "notes"
    )
    column_searchable_list = ("id", "staff_id", "customer_id")
    column_filters = ("staff_id", "customer_id", "starts_at")
    can_view_details = True

    column_formatters = {
        "services": _service_names,
        "starts_at": _fmt_starts_at,  # <-- 12-hour time + date
    }
def setup_admin(app):
    app.secret_key = os.environ.get("FLASK_APP_KEY", "sample key")
    app.config["FLASK_ADMIN_SWATCH"] = "cerulean"
    admin = Admin(app, name="4Geeks Admin", template_mode="bootstrap3")

    # Add your models here
    admin.add_view(UserAdmin(User, db.session))
    admin.add_view(AppointmentAdmin(Appointment, db.session))
