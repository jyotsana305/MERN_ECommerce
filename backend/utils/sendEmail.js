import nodemailer from 'nodemailer';

export const sendEmail=async(options)=>{
    const transporter=nodemailer.createTransport({
        
        host:process.env.SMTP_HOST || 'smtp-relay.brevo.com',
        port:Number(process.env.SMTP_PORT) || 587,
        secure:process.env.SMTP_SECURE==='true', // true only for port 465; 587/2525 use STARTTLS (false)
        auth:{
            user:process.env.SMTP_MAIL, // your Brevo account login email
            pass:process.env.SMTP_PASSWORD // your Brevo SMTP key, NOT your account password - generate one under Brevo > SMTP & API > SMTP
        }
    })
    const mailOptions={
        // Brevo requires the "from" address to be a sender you've verified
        // in Brevo > Senders, Domains & Dedicated IPs - otherwise it rejects
        // the send even with valid SMTP credentials.
        from:process.env.SMTP_FROM || process.env.SMTP_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    await transporter.sendMail(mailOptions);
}
