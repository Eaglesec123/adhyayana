import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import razorpay
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)
CORS(app)

# =========================
# FIREBASE INIT
# =========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_ACCOUNT_PATH = os.path.join(BASE_DIR, "serviceAccountKey.json")

cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
firebase_admin.initialize_app(cred)
db = firestore.client()

# =========================
# RAZORPAY TEST KEYS
# =========================

RAZORPAY_KEY = "rzp_test_SG54KSI2Pb6QzN"
RAZORPAY_SECRET = "hpvzN2k9y4P2NjWaqx77LOeA"

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY, RAZORPAY_SECRET))


# =========================
# CREATE ORDER
# =========================

@app.route("/create-order", methods=["POST"])
def create_order():
    try:
        data = request.json
        course_id = data.get("courseId")

        if not course_id:
            return jsonify({"error": "Course ID missing"}), 400

        course_doc = db.collection("courses").document(course_id).get()

        if not course_doc.exists:
            return jsonify({"error": "Course not found"}), 404

        course = course_doc.to_dict()
        price = int(course.get("price", 0))

        if price <= 0:
            return jsonify({"error": "Invalid course price"}), 400

        # Razorpay expects amount in paise
        amount_paise = price * 100

        order = razorpay_client.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "payment_capture": 1
        })

        return jsonify({
            "orderId": order["id"],
            "amount": amount_paise,   # send paise to frontend
            "key": RAZORPAY_KEY
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# VERIFY PAYMENT
# =========================

@app.route("/verify-payment", methods=["POST"])
def verify_payment():
    try:
        data = request.json

        course_id = data.get("courseId")
        payment_id = data.get("paymentId")
        order_id = data.get("orderId")
        signature = data.get("signature")

        if not all([course_id, payment_id, order_id, signature]):
            return jsonify({"error": "Missing payment data"}), 400

        # 🔐 Verify Razorpay signature
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        })

        # Fetch course price
        course_doc = db.collection("courses").document(course_id).get()

        if not course_doc.exists:
            return jsonify({"error": "Course not found"}), 404

        course = course_doc.to_dict()
        price = int(course.get("price", 0))

        # 80 / 20 split
        creator_share = round(price * 0.8, 2)
        company_share = round(price * 0.2, 2)

        # Save order record
        db.collection("orders").add({
            "courseId": course_id,
            "amount": price,
            "creatorEarning": creator_share,
            "companyEarning": company_share,
            "paymentId": payment_id,
            "orderId": order_id,
            "status": "paid"
        })

        return jsonify({"status": "success"})

    except razorpay.errors.SignatureVerificationError:
        return jsonify({"error": "Payment verification failed"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# HEALTH CHECK
# =========================

@app.route("/")
def home():
    return "Backend running successfully 🚀"


if __name__ == "__main__":
    app.run(port=5000, debug=True)
