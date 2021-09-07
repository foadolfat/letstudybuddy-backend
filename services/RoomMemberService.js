/**
 * @typedef {Object} RoomMember
 * @property {number} room_id
 * @property {number} user_id
 * @property {string} username
 * @property {number} date_created
 */

/**
 * @typedef {Object} RoomMemberDTO
 * @property {number} room_id
 * @property {number} user_id
 */

 const BaseService = require("./BaseService");
 const Result = require("./Result").Result;
 
 class RoomMemberService extends BaseService{
     
     /**
      * @param {RoomMemberDTO} roomMemberDTO
      * @returns {Promise<Result<RoomMember>>}
      */
     createRoomMember(roomMemberDTO) { }


     /**
      * @param {RoomMemberDTO} roomMemberDTO
      * @returns {Promise<Result<boolean>>} 
      */
     deleteRoomMember(roomMemberDTO) { }


     /**
      * @param {RoomMemberDTO} roomMemberDTO
      * @returns {Promise<Result<RoomMember>>}
      */
     updateRoomMember(roomMemberDTO) { }
 

     /**
      * @param {RoomMemberDTO} roomMemberDTO
      * @returns {Promise<Result<RoomMember>>}
      */
     getRoomMember(roomMemberDTO){ }

     /**
      * @param {number} room_id
      * @returns {Promise<Result<RoomMember>>}
      */
     getMembersByRoom(room_id){ }

    /**
      * @param {number} user_id
      * @returns {Promise<Result<RoomMember>>}
      */
     getRoomsAndMembers(user_id){ }

         /**
     * @param {number} user_id
     * @param {number} peer_id
     * @returns {Promise<Result<boolean>>} 
     */
     checkForCommonRoom(user_id, peer_id) {}

 };
 
 module.exports = RoomMemberService