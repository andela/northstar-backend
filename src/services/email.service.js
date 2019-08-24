import sgMail from '@sendgrid/mail';

// Setup this key on your .env usDrVXltTtqz6NnsAornNQ.WsLmjMfrwEin01Dj7aQ6xZ14eLqgC5o6lzS_Qw77yFw
sgMail.setApiKey(process.env.SEND_GRID_API);

const templates = {
  travel_request_notification: 'd-052f3ce066de4a92aa33d254d678e34d',
  signup_template: 'd-9f73a2f3606c4dbcacb03cdb46df8948'
};

/**
 * @param {String} from The email of the sender
 * @param {object} to The user's email
 * @param {object} templateName The name of the template from sendgrid
 * @param {object} payload The user's details to be returned on the send grid template
 * @returns {object} An email on user's email
 */
async function sendEmail(from, to, templateName, payload = null) {
  const msg = {
    from,
    to,
    templateId: templates[templateName],
    dynamic_template_data: {
      ...payload
    }
  };
  try {
    await sgMail.send(msg);
    console.log('Succesfully Sent');
  } catch (err) {
    console.log(err);
  }
}
export default { sendEmail };
