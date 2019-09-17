import sgMail from '@sendgrid/mail';
import logger from '../logs/winston';

// Setup this key on your .env
sgMail.setApiKey(process.env.SEND_GRID_API);

const templates = {
  travel_request_notification: 'd-cc74a988ed8543638b08837316ff0048',
  signup_template: 'd-015ec1b46e75468897414d8e04cb762a',
  request_rejected: 'd-5578c7c2a58f43dba314ad5800cdb00d',
  passord_reset: 'd-0e43d73f3e3048bba2d124ff5f384107',
  request_approved: 'd-284de148088e4d86bf158a9abcf9d7cf'
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
    logger.info('Successfully Sent');
  } catch (err) {
    logger.error(err);
  }
}
export default { sendEmail };
