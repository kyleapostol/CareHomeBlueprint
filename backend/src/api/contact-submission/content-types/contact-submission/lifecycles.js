module.exports = {
  async afterCreate(event) {
    const { result } = event;

    try {
      await strapi.plugins['email'].services.email.send({
        to: 'kyleapostol@yahoo.com', // Your target inbox
        subject: `New Inquiry: ${result.name} (${result.topic.toUpperCase()})`,
        text: `You have a new inquiry!\n\nName: ${result.name}\nEmail: ${result.email}\nTopic: ${result.topic}\nMessage: ${result.message}`,
      });
      console.log('Lead notification email sent.');
    } catch (err) {
      console.error('Email notification failed:', err);
    }
  },
};