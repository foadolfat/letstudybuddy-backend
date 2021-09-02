/**
 * @typedef {Object} Room
 * @property {number} room_id
 * @property {number} date_created
 */

/**
 * @typedef {Object} RoomDTO
 * @property {number} room_id
 */

 const BaseService = require("./BaseService");
 const Result = require("./Result").Result;
 
 class RoomsService extends BaseService{
     
     /**
      * @returns {Promise<Result<Room>>}
      */
     createRoom() { }


     /**
      * @param {number} room_id
      * @returns {Promise<Result<boolean>>} 
      */
     deleteRoom(room_Id) { }


     /**
      * @param {RoomDTO} roomDTO
      * @returns {Promise<Result<Room>>}
      */
     updateRoom(roomDTO) { }
 

     /**
      * @param {number} room_id
      * @returns {Promise<Result<Room>>}
      */
     getRoom(room_id){ }



 };
 
 module.exports = RoomsService