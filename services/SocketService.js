/**
 * @typedef {Object} Socket
 * @property {string} socket_id
 * @property {number} user_id
 */

/**
 * @typedef {Object} SocketDTO
 * @property {string} socket_id
 * @property {number} user_id
 */

 const BaseService = require("./BaseService");
 const Result = require("./Result").Result;
  
 class SocketService extends BaseService{
     /**
      * @param {string} socket_id
      * @param {number} user_id
      * @returns {Promise<Result<Socket>>}
      */
     createSocket(socket_id, user_id){}
 
     /**

      * @param {number} user_id
      * @returns {Promise<Result<Socket>>}
      */
     getSocket(user_id){}
 
      /**
      * @param {string} socket_id
      * @param {number} user_id
      * @returns {Promise<Result<boolean>>}
      */
     deleteSocket(socket_id, user_id){}
 
     /**
      * @param {string} socket_id
      * @param {number} user_id
      * @returns {Promise<Result<Socket>>}
      */
     updateSocket(socket_id, user_id){}

 
 
 }
 module.exports = SocketService