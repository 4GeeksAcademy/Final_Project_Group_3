import os
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from dotenv import load_dotenv

# Load .env values (make sure you start the app from the backend directory)
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ---- Config from .env ----
ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "").strip()
AUTH_TOKEN  = os.getenv("TWILIO_AUTH_TOKEN", "").strip()
TWILIO_FROM = os.getenv("TWILIO_FROM", "").strip()     # e.g. +17868233203
OWNER_PHONE = os.getenv("OWNER_PHONE", "").strip()     # e.g. +17864935524
DRY_RUN     = os.getenv("DRY_RUN", "true").strip().lower() == "true"

def e164(num: str | None) -> str | None:
    """Return sanitized E.164-ish phone (+ and digits) or None."""
    if not num:
        return None
    s = "".join(ch for ch in str(num).strip() if ch.isdigit() or ch == "+")
    return s if s.startswith("+") and len(s) >= 8 else None

@app.route("/api/health")
def health():
    return jsonify(
        ok=True,
        dry_run=DRY_RUN,
        has_sid=bool(ACCOUNT_SID),
        has_auth=bool(AUTH_TOKEN),
        has_from=bool(TWILIO_FROM),
        has_owner=bool(OWNER_PHONE),
    )

@app.route("/api/sms/send", methods=["POST"])
def send_sms():
    try:
        data = request.get_json(silent=True) or {}
        booking  = data.get("booking") or {}
        customer = booking.get("customer") or {}
        service  = booking.get("service") or {}
        staff    = booking.get("staff") or {}
        date     = (booking.get("date") or "").strip()
        time_    = (booking.get("time") or "").strip()

        # ---- Validate inputs ----
        cust_phone = e164(customer.get("phone"))
        owner_phone = e164(OWNER_PHONE)
        if not cust_phone:
            return jsonify(ok=False, error="Invalid/missing customer phone (use E.164 like +1786XXXXXXX)."), 400
        if not TWILIO_FROM:
            return jsonify(ok=False, error="TWILIO_FROM missing in .env"), 500
        if not owner_phone:
            return jsonify(ok=False, error="OWNER_PHONE missing/invalid in .env"), 500
        if not (ACCOUNT_SID and AUTH_TOKEN) and not DRY_RUN:
            return jsonify(ok=False, error="Twilio credentials missing in .env"), 500

        # ---- Compose messages ----
        tip_val = (booking.get("payment") or {}).get("tip", 0)
        customer_msg = (
            f"Hi {customer.get('firstName','there')}! Your appointment at Glamour Nails is confirmed.\n"
            f"📅 {date} {time_}\n"
            f"💅 {service.get('name','Service')} with {staff.get('name','Technician')}\n"
            f"See you soon!"
        )
        business_msg = (
            "🆕 NEW BOOKING ALERT\n"
            f"Customer: {customer.get('firstName','')} {customer.get('lastName','')}\n"
            f"Phone: {cust_phone}\n"
            f"Service: {service.get('name','')}\n"
            f"Staff: {staff.get('name','')}\n"
            f"Date: {date} {time_}\n"
            f"Tip: ${tip_val}"
        )

        # ---- DRY RUN: do not hit Twilio, just log ----
        if DRY_RUN:
            print("[DRY_RUN] Would send to customer:", customer_msg)
            print("[DRY_RUN] Would send to owner:", business_msg)
            return jsonify(ok=True, dry_run=True)

        # ---- Real send with Twilio ----
        client = Client(ACCOUNT_SID, AUTH_TOKEN)

        # Send to customer
        try:
            sms1 = client.messages.create(
                from_=TWILIO_FROM,
                to=cust_phone,
                body=customer_msg
            )
        except TwilioRestException as te:
            # Return Twilio’s exact reason
            return jsonify(
                ok=False,
                error=f"Customer SMS failed: {te.msg}",
                code=getattr(te, 'code', None),
                status=getattr(te, 'status', None),
            ), 502

        # Send to owner (business alert). If this fails, still return success for customer.
        try:
            sms2 = client.messages.create(
                from_=TWILIO_FROM,
                to=owner_phone,
                body=business_msg
            )
            return jsonify(ok=True, dry_run=False, customer_sid=sms1.sid, business_sid=sms2.sid)
        except TwilioRestException as te:
            return jsonify(
                ok=True,
                partial=True,
                customer_sid=sms1.sid,
                owner_error=f"Owner SMS failed: {te.msg}",
                owner_code=getattr(te, 'code', None),
                owner_status=getattr(te, 'status', None),
            )

    except Exception as e:
        traceback.print_exc()
        return jsonify(ok=False, error=str(e)), 500

if __name__ == "__main__":
    # Bind to 0.0.0.0 for Codespaces and similar environments
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=True)
