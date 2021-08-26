/**
 * @typedef {Object} Peer
 * @property {number} peer_id
 * @property {string} fName
 * @property {string} lName
 * @property {string} major
 * @property {string} degree
 * @property {string} grad
 */


 const BaseService = require("./BaseService");
 const Result = require("./Result").Result;
 
 class SuggestionsService extends BaseService{
     
     /**
      * @param {number} user_id
      * @returns {Promise<Result<Peer>>}
      */
     createSuggestion(user_id) { }

 };
 
 module.exports = SuggestionsService