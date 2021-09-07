/**
 * @typedef {Object} Notification
 * @property {number} room_id
 * @property {number} user_id
 * @property {number} num
 * @property {string} event_key
 */

/**
 * @typedef {Object} NotificationDTO
 * @property {number} room_id
 * @property {number} user_id
 * @property {number} num
 * @property {string} event_key
 */

 const BaseService = require("./BaseService");
 const Result = require("./Result").Result;
 
 class NotificationsService extends BaseService{
     
     /**
      * @property {number} room_id
      * @property {number} user_id
      * @property {number} num
      * @property {string} event_key
      * @returns {Promise<Result<Notification>>}
      */
     createNotification(user_id, room_id, event_key, num) { }

     /**
      * @property {number} room_id
      * @property {number} user_id
      * @property {string} event_key
      * @returns {Promise<Result<boolean>>} 
      */
     deleteNotificationByEvent(user_id, room_id, event_key) { }

     /**
      * @property {number} room_id
      * @property {number} user_id
      * @returns {Promise<Result<boolean>>} 
      */
     deleteNotificationByRoom(user_id, room_id) { }

     /**
      * @property {number} user_id
      * @returns {Promise<Result<boolean>>} 
      */
     deleteNotificationByUser(user_id) { }

     /**
      * @property {number} room_id
      * @property {number} user_id
      * @property {number} num
      * @property {string} event_key
      * @returns {Promise<Result<Notification>>}
      */
     updateNotification(user_id, room_id, event_key, num) { }
 
     /**
      * @property {number} room_id
      * @property {number} user_id
      * @property {string} event_key
      * @returns {Promise<Result<Notification>>}
      */
     getNotification(user_id, room_id, event_key){ }

     /**
      * @property {number} room_id
      * @property {number} user_id
      * @returns {Promise<Result<Notification>>}
      */
     getNotificationsByRoom(user_id, room_id){ }

     /**
      * @property {number} user_id
      * @returns {Promise<Result<Notification>>}
      */
     getNotificationsByUser(user_id){ }

 };
 
 module.exports = NotificationsService