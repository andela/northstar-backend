import models from '../db/models';

const { Notification } = models;


/* eslint-disable */
export default class NotificationContoller {
  static markAsRead(req, res) {
   
    
     Notification.update( { read: true },{where: { receiver_id: req.currentUser.id },attributes: ['read']})
     .then((data) => {
      if (data) {
      return res.status(200).json({
        status: 'success',
        data:data[1],
        message: 'All Notification marked as read'
      });
    }
    return res.status(404).json({
      status: 'error',
      error: 'No notification found'
    });
    })
    .catch((err) => {
      res.status(500).json({
        status: 'error',
        message: err.message,
        info: 'Internal Server Error',
      });
    });
}
}