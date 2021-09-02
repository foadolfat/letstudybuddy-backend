/**
 * @typedef {Object} Message
 * @property {number} room_id
 * @property {number} user_id
 * @property {string} username
 * @property {string} content
 * @property {number} date_sent
 */

/**
 * @typedef {Object} MessageDTO
 * @property {number} room_id
 * @property {number} user_id
 * @property {string} content
 * @property {number} date_sent
 */

const BaseService = require("./BaseService");
const Result = require("./Result").Result;
 
class MessagesService extends BaseService{
    /**
     * @param {MessageDTO} messageDTO
     * @param {number} user_id
     * @returns {Promise<Result<boolean>>}
     */
    createMessage(messageDTO, user_id){}

    /**
     * @param {MessageDTO} messageDTO
     * @param {number} user_id
     * @returns {Promise<Result<Message>>}
     */
    getUserMessages(messageDTO, user_id){}

     /**
     * @param {MessageDTO} messageDTO
     * @returns {Promise<Result<Message>>}
     */
    getRoomMessages(messageDTO){}

    /**
     * @param {MessageDTO} messageDTO
     * @param {number} user_id
     * @returns {Promise<Result<boolean>>}
     */
    deleteMessages(messageDTO, user_id){}

    /**
     * @param {MessageDTO} messageDTO
     * @param {number} user_id
     * @returns {Promise<Result<boolean>>}
     */
    deleteMessage(messageDTO, user_id){}

    /**
     * @param {MessageDTO} messageDTO
     * @param {number} user_id
     * @returns {Promise<Result<boolean>>}
     */
    updateMessages(messageDTO, user_id){}


}
module.exports = MessagesService