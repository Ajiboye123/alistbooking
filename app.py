from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)  # Enable detailed logging

def send_email(to_email, subject, body):
    """Sends a simplified email using Gmail SMTP."""

    sender_email = "dancicada5@gmail.com"  # Your email
    sender_password = "5V12an9gs8BC0GWK"  # Your password or app password

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = to_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server: #Change to gmail
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, to_email, message.as_string())
        logging.info("Email sent successfully") #Log if successful.
        return True
    except Exception as e:
        logging.error(f"Error sending email: {e}", exc_info=True)
        return False

@app.route('/send-email', methods=['POST'])
def send_email_route():
    try:
        data = request.get_json()
        message = data['message']
        to_email = "dancicada5@gmail.com"  # Replace with the actual recipient's email!
        subject = "New Chat Message from Website"
        body = f"Chat Message: {message}"

        if send_email(to_email, subject, body):
            return jsonify({"message": "Email sent successfully!"}), 200
        else:
            return jsonify({"message": "Email sending failed."}), 500

    except Exception as e:
        logging.error(f"Error in send_email_route: {e}", exc_info=True)
        return jsonify({"message": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)

    @app.route('/test-email', methods=['GET'])
def test_email():
    if send_email("recipient@example.com", "Test Email", "This is a test"):
        return "Test email sent"
    else:
        return "Test email failed"