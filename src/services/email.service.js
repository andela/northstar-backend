import sgMail from '@sendgrid/mail';
import logger from '../logs/winston';

// Setup this key on your .env
sgMail.setApiKey(process.env.SEND_GRID_API);

const templates = {
  travel_request_notification: 'd-56e432ed8cfd4093afbb695458ac2880',
  signup_template: 'd-b344aeccd8fd4532a1f03658a92bda50',
  request_rejected: 'd-a54b425dc20e42adbe6bd16bdb8dd3aa',
  passord_reset: 'd-0e43d73f3e3048bba2d124ff5f384107',
  request_approved: 'd-8a49cb87af9b4549ab370fcc42e2874c'
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
