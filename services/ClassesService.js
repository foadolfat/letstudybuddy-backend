/**
 * @typedef {Object} Class
 * @property {string} class_name
 * @property {string} school
 * @property {string} expected_end
 * @property {string} prof
 */

/**
 * @typedef {Object} ClassDTO
 * @property {string} class_name
 * @property {string} school
 * @property {string} expected_end
 * @property {string} prof
 */

 const BaseService = require("./BaseService");
 const Result = require("./Result").Result;
 
 class ClassService extends BaseService{
     
     /**
      * @param {ClassrDTO} classDTO
      * @param {number} user_id
      * @returns {Promise<Result<Class>>}
      */
     createClass(classDTO, user_id) { }


     /**
      * @param {number} user_id
      * @param {string} class_name
      * @param {string} school
      * @returns {Promise<Result<boolean>>} 
      */
     deleteClass(user_id, class_name, school) { }


     /**
      * @param {ClassDTO} classDTO
      * @param {number} user_id
      * @returns {Promise<Result<Class>>}
      */
     updateClass(classDTO, user_id) { }
 

     /**
      * @param {number} user_id
      * @returns {Promise<Result<Class>>}
      */
     getClasses(user_id){ }

     /**
      * @param {number} user_id
      * @param {number} peer_id
      * @returns {Promise<Result<Class>>}
      */
      getPeerClasses(user_id, peer_id){ }

 };
 
 module.exports = ClassService