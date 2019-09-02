import sgMail from '@sendgrid/mail';
import logger from '../logs/winston';

// Setup this key on your .env
sgMail.setApiKey(process.env.SEND_GRID_API);

const templates = {
  travel_request_notification: 'd-963a476c77a34f318895713712b4d6bb',
  signup_template: 'd-1ae0bd2e62c742e9a78009512bd1b5b8',
  request_rejected: 'd-ccd25aa2dd9f47cb9d746d909787db59',
  passord_reset: 'd-0e43d73f3e3048bba2d124ff5f384107'

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
