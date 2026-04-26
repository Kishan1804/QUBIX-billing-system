export const resetOtpTemplate = (name, otp) => {
    return `
    <div style="font-family:Arial">
      <h2>Password Reset OTP</h2>

      <p>Hello ${name},</p>

      <p>Your OTP for password reset is:</p>

      <h1 style="
        letter-spacing:3px;
        background:#f3f4f6;
        padding:10px;
        display:inline-block
      ">
        ${otp}
      </h1>

      <p>This OTP will expire in 10 minutes.</p>

      <p>MERN Billing Team</p>
    </div>
  `;
};


export const contactConfirmationTemplate = (name, message) => {
    return `
    <div style="font-family:Arial">
      <h2>Message Received</h2>

      <p>Hello ${name},</p>

      <p>Thank you for contacting MERN Billing support.</p>

      <p>Your message:</p>

      <div style="
        background:#f9fafb;
        padding:12px;
        border-left:4px solid #2563eb
      ">
        ${message}
      </div>

      <p>Our team will contact you soon.</p>

      <p>Regards,<br/>MERN Billing</p>
    </div>
  `;
};