/**
 * @typedef {Object} User
 * @property {number} user_id
 * @property {string} username
 * @property {string} fName
 * @property {string} lName
 * @property {string} email
 * @property {string} major
 * @property {string} degree
 * @property {string} grad
 * @property {string} password
 */

/**
 * @typedef {Object} UserDTO
 * @property {string} username
 * @property {string} fName
 * @property {string} lName
 * @property {string} email
 * @property {string} major
 * @property {string} degree
 * @property {string} grad
 */

 const BaseService = require("./BaseService");
 const Result = require("./Result").Result;
 
 class UsersService extends BaseService{
     
     /**
      * @param {UserDTO} userDTO
      * @param {string} password
      * @returns {Promise<Result<User>>}
      */
     createUser(userDTO, password) { }


     /**
      * @param {number} user_id
      * @returns {Promise<Result<boolean>>} 
      */
     deleteUser(user_id) { }


     /**
      * @param {number} user_id
      * @param {UserDTO} userDTO
      * @returns {Promise<Result<User>>}
      */
     updateUser(user_id, userDTO) { }
 

     /**
      * @param {number} user_id
      * @param {number} username
      * @param {number} email
      * @returns {Promise<Result<User>>}
      */
     getUser(user_id, username, email){ }
 

 };
 
 module.exports = UsersService