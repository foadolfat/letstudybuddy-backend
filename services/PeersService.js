/**
 * @typedef {Object} Peer
 * @property {number} user_id
 * @property {number} peer_id
 * @property {boolean} liked
 */

/**
 * @typedef {Object} PeerDTO
 * @property {number} user_id
 * @property {number} peer_id
 * @property {boolean} liked
 */

 const BaseService = require("./BaseService");
 const Result = require("./Result").Result;
 
 class PeersService extends BaseService{
     
     /**
      * @param {PeerDTO} peerDTO
      * @param {PeerDTO} user_id
      * @param {PeerDTO} peer_id
      * @returns {Promise<Result<Peer>>}
      */
     createPeer(PeerDTO, user_id, peer_id) { }


     /**
      * @param {PeerDTO} user_id
      * @param {PeerDTO} peer_id
      * @returns {Promise<Result<boolean>>} 
      */
     deletePeer(user_id, peer_id) { }


     /**
      * @param {PeerDTO} peerDTO
      * @param {PeerDTO} user_id
      * @param {PeerDTO} peer_id
      * @returns {Promise<Result<Peer>>}
      */
     updatePeer(userDTO, user_id, peer_id) { }
 

     /**
      * @param {PeerDTO} user_id
      * @param {PeerDTO} peer_id
      * @returns {Promise<Result<Peer>>}
      */
     getPeer(user_id, peer_id){ }

 };
 
 module.exports = PeersService