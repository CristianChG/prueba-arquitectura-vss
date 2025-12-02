import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

class EmailService:
    """Service for sending emails using SMTP."""

    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.logger = logging.getLogger(__name__)

    def send_reset_code(self, to_email: str, code: str):
        """Send password reset code to user."""
        if not all([self.smtp_host, self.smtp_user, self.smtp_password]):
            self.logger.warning("Email configuration missing. Printing code to logs instead.")
            self.logger.info(f"RESET CODE for {to_email}: {code}")
            return

        try:
            msg = MIMEMultipart()
            msg['From'] = self.smtp_user
            msg['To'] = to_email
            msg['Subject'] = "Código de Recuperación de Contraseña - Vacas App"

            body = f"""
            <html>
                <body>
                    <h2>Solicitud de Recuperación de Contraseña</h2>
                    <p>Has solicitado restablecer tu contraseña. Usa el siguiente código para continuar:</p>
                    <h1 style="color: #4CAF50; letter-spacing: 5px;">{code}</h1>
                    <p>Este código expirará en 15 minutos.</p>
                    <p>Si no solicitaste esto, por favor ignora este correo.</p>
                </body>
            </html>
            """
            msg.attach(MIMEText(body, 'html'))

            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
            
            self.logger.info(f"Reset code sent to {to_email}")

        except Exception as e:
            self.logger.error(f"Failed to send email to {to_email}: {str(e)}")
            # Fallback for development/debugging if email fails
            self.logger.info(f"FALLBACK: RESET CODE for {to_email}: {code}")
            raise e
