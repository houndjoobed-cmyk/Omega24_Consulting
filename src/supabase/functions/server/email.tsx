// Email configuration and sending functions

interface EmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(data: EmailData): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  
  if (!resendApiKey) {
    console.error('RESEND_API_KEY not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #002F6C, #4DA6FF); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f4f4f4; padding: 30px; }
    .field { background: white; padding: 15px; margin-bottom: 15px; border-radius: 5px; border-left: 4px solid #4DA6FF; }
    .field-label { font-weight: bold; color: #002F6C; margin-bottom: 5px; }
    .field-value { color: #555; }
    .footer { background: #002F6C; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 Nouveau Message de Contact</h1>
      <p>OMEGA24 CONSULTING</p>
    </div>
    <div class="content">
      <p>Vous avez reçu un nouveau message depuis le formulaire de contact du site web.</p>
      
      <div class="field">
        <div class="field-label">👤 Nom complet</div>
        <div class="field-value">${data.name}</div>
      </div>
      
      <div class="field">
        <div class="field-label">📧 Email</div>
        <div class="field-value">${data.email}</div>
      </div>
      
      ${data.phone ? `
      <div class="field">
        <div class="field-label">📱 Téléphone</div>
        <div class="field-value">${data.phone}</div>
      </div>
      ` : ''}
      
      <div class="field">
        <div class="field-label">📋 Sujet</div>
        <div class="field-value">${data.subject}</div>
      </div>
      
      <div class="field">
        <div class="field-label">💬 Message</div>
        <div class="field-value">${data.message.replace(/\n/g, '<br>')}</div>
      </div>
      
      <p style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 5px; color: #002F6C;">
        <strong>💡 Astuce :</strong> Répondez directement à cet email pour contacter ${data.name} à l'adresse ${data.email}
      </p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} OMEGA24 CONSULTING. Tous droits réservés.</p>
      <p>Cet email a été envoyé automatiquement depuis votre site web.</p>
    </div>
  </div>
</body>
</html>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'OMEGA24 CONSULTING <onboarding@resend.dev>', // Resend's default sender for testing
        to: ['omega24consulting@gmail.com'],
        reply_to: data.email,
        subject: `🔔 Nouveau message : ${data.subject}`,
        html: emailBody
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      return { success: false, error: 'Failed to send email' };
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return { success: true };

  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}
