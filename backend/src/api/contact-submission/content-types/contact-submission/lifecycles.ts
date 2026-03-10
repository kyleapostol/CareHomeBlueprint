import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export default {
  async afterCreate(event) {
    const { result } = event;

    // Prevent duplicate emails from Draft/Publish
    if (result.publishedAt) return;

    try {
      await resend.emails.send({
        from: 'notification@myproviderpath.com',
        to: 'kyleapostol@yahoo.com',
        replyTo: result.email,
        subject: `New Inquiry: ${result.name}`,
        html: `
          <h3>New Lead Details</h3>
          <ul>
            <li><strong>Name:</strong> ${result.name}</li>
            <li><strong>Email:</strong> ${result.email}</li>
            <li><strong>Phone:</strong> ${result.phone || 'Not logged in'}</li>
            <li><strong>Topic:</strong> ${result.topic}</li>
          </ul>
          <p><strong>Message:</strong></p>
          <p>${result.message}</p>
        `,
      });
      console.log('Email sent with phone info.');
    } catch (err) {
      console.error('Email failed:', err);
    }
  }
};