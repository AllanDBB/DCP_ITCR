const nodemailer = require('nodemailer');

// Configuración del transporter de nodemailer
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail', // Cambia esto según tu proveedor de email
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Plantilla para el correo de recuperación de contraseña
const createPasswordResetEmail = (username, resetUrl) => {
    return {
        subject: 'Recuperación de contraseña - DCP ITCR',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Recuperación de contraseña</h2>
                <p>Hola ${username},</p>
                <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
                <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
                    Restablecer contraseña
                </a>
                <p>Este enlace expirará en 1 hora.</p>
                <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
                <br>
                <p>Saludos,<br>El equipo de DCP ITCR</p>
            </div>
        `
    };
};

// Función para enviar correo de recuperación de contraseña
const sendPasswordResetEmail = async (email, username, resetToken) => {
    try {
        const transporter = createTransporter();
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
        const emailContent = createPasswordResetEmail(username, resetUrl);

        const mailOptions = {
            to: email,
            from: process.env.EMAIL_USER,
            ...emailContent
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Correo enviado exitosamente' };
    } catch (error) {
        console.error('Error al enviar correo:', error);
        return { success: false, message: 'Error al enviar correo', error };
    }
};

// Función genérica para enviar cualquier correo
const sendEmail = async (to, subject, html, from = process.env.EMAIL_USER) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            to,
            from,
            subject,
            html
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Correo enviado exitosamente' };
    } catch (error) {
        console.error('Error al enviar correo:', error);
        return { success: false, message: 'Error al enviar correo', error };
    }
};

module.exports = {
    sendPasswordResetEmail,
    sendEmail,
    createTransporter
};
