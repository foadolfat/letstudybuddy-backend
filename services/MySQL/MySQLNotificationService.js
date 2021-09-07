const ERROR_CODES = require("../errors");
const { Result, IError } = require("../Result");
const ClassesService = require("../ClassesService");


class MySQLNotificationService extends ClassesService {
    /**
     * @param {import("mysql").Pool} connection
     */
     constructor(connection) {
        super();
        /**
         * @private
         * @type {import("mysql").Pool}
         */
        this.connection = connection;
    }

     /**
      * @property {number} room_id
      * @property {number} user_id
      * @property {number} num
      * @property {string} event_key
      * @returns {Promise<import("../NotificationService").Notification>}
     */
    async createNotification(user_id, room_id, event_key, num) {
        const createNotificationCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: `INSERT INTO notifications (USER_ID, ROOM_ID, EVENT_KEY, NUM) VALUES(?,?,?,?)
                        ON DUPLICATE KEY UPDATE NUM = NUM + 1;`,
                values:[user_id, room_id, event_key, num]
            },
            (err, results, fields) => {
                
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            await createNotificationCMD;

        } catch(e) {
            switch(e.errno) {
                // duplicate entry
                case 1062: {
                    return new Result(
                        null,
                        new IError(
                            `Error ${ERROR_CODES.DATABASE.DUPLICATE.TXT}.`,
                            ERROR_CODES.DATABASE.DUPLICATE.NUM
                        ));
                }
                case 1404: {
                    return new Result(
                        null,
                        new IError(
                            `Error ${ERROR_CODES.DATABASE.NOT_FOUND.TXT}.`,
                            ERROR_CODES.DATABASE.NOT_FOUND.NUM
                        ));
                }
            }

            console.log(e.code, e.errno);

            return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
        return this.getNotificationsByUser(user_id);
    }

     /**
      * @property {number} room_id
      * @property {number} user_id
      * @property {string} event_key
      * @returns {Promise<Result<boolean>>} 
      */
    async deleteNotificationByEvent(user_id, room_id, event_key) {
        const deleteNotificationByEventCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM notifications WHERE USER_ID=? AND ROOM_ID=? AND EVENT_KEY=?;",
                values:[user_id, room_id, event_key]
            },
            (err, results, fields) => {
                
                if(err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
        try{
            const results = await deleteNotificationByEventCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);

        } catch(e) {

			console.log(e.code, e.errno);

			return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
    }

     /**
      * @property {number} room_id
      * @property {number} user_id
      * @returns {Promise<Result<boolean>>} 
      */
    async deleteNotificationByRoom(user_id, room_id) {
        const deleteNotificationByRoomCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM notifications WHERE USER_ID=? AND ROOM_ID=?;",
                values:[user_id, room_id]
            },
            (err, results, fields) => {
                
                if(err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
        try{
            const results = await deleteNotificationByRoomCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);

        } catch(e) {

			console.log(e.code, e.errno);

			return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
    }

     /**
      * @property {number} user_id
      * @returns {Promise<Result<boolean>>} 
      */
    async deleteNotificationByUser(user_id) {
        const deleteNotificationByUserCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM notifications WHERE USER_ID=?;",
                values:[user_id]
            },
            (err, results, fields) => {
                
                if(err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
        try{
            const results = await deleteNotificationByUserCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);

        } catch(e) {

            console.log(e.code, e.errno);

            return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
    }

     /**
      * @property {number} room_id
      * @property {number} user_id
      * @property {number} num
      * @property {string} event_key
      * @returns {Promise<import("../NotificationService").Notification>}
      */
    async updateNotification(user_id, room_id, event_key, num) { 
        const updateNotificationCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "UPDATE notifications SET NUM=? WHERE USER_ID=? AND ROOM_ID=? AND EVENT_KEY=?;",
                values:[num, user_id, room_id, event_key ]
            },
            (err, results, fields) => {
                
                if(err) {
                    
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const results = await updateNotificationCMD;
            return new Result(results, null);
        } catch(e) {
            switch(e.errno) {
				// duplicate entry
				case 1062: {
					return new Result(
						null,
						new IError(
							`Error ${ERROR_CODES.DATABASE.DUPLICATE.TXT}.`,
							ERROR_CODES.DATABASE.DUPLICATE.NUM
						));
				}
			}

			return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }

     }
 
      /**
       * @property {number} room_id
       * @property {number} user_id
       * @property {string} event_key
       * @returns {Promise<import("../NotificationService").Notification>}
       */
    async getNotification(user_id, room_id, event_key){ 
        const getNotificationCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT * FROM notifications where USER_ID=? AND ROOM_ID=? AND EVENT_KEY=?;",
                values: [user_id, room_id, event_key]
            }, (err, results, fields) => {
                
                if(err){
                    return reject(err);
                }

                if(!results || results.length === 0){
                    //wtf
                    var err = new Error("User does not exist!");
                    err.errno = 1404;
                    err.code = "NOT FOUND";
                    return reject(err);
                }
                resolve(results[0]);
            });
        });
        try{
            const newNotification = await getNotificationCMD;
            return new Result(newNotification, null);

        } catch(e) {
            switch(e.errno) {
                // duplicate entry
                case 1404: {
                    return new Result(
                        null,
                        new IError(
                            `Error ${ERROR_CODES.DATABASE.NOT_FOUND.TXT}.`,
                            ERROR_CODES.DATABASE.NOT_FOUND.NUM
                        ));
                }
            }


            return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
        
        } 
    }
 
      /**
       * @property {number} room_id
       * @property {number} user_id
       * @returns {Promise<import("../NotificationService").Notification>}
       */
    async getNotificationsByRoom(user_id, room_id){ 
        const getNotificationsByRoomCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT * FROM notifications where USER_ID=? AND ROOM_ID=?;",
                values: [user_id, room_id]
            }, (err, results, fields) => {
                
                if(err){
                    return reject(err);
                }

                if(!results || results.length === 0){
                    //wtf
                    var err = new Error("User does not exist!");
                    err.errno = 1404;
                    err.code = "NOT FOUND";
                    return reject(err);
                }
                resolve(results[0]);
            });
        });
        try{
            const newNotification = await getNotificationsByRoomCMD;
            return new Result(newNotification, null);

        } catch(e) {
            switch(e.errno) {
                // duplicate entry
                case 1404: {
                    return new Result(
                        null,
                        new IError(
                            `Error ${ERROR_CODES.DATABASE.NOT_FOUND.TXT}.`,
                            ERROR_CODES.DATABASE.NOT_FOUND.NUM
                        ));
                }
            }


            return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
        
        }
     }
 
      /**
       * @property {number} user_id
       * @returns {Promise<import("../NotificationService").Notification>}
       */
    async getNotificationsByUser(user_id){ 
        const getNotificationsByUserCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT * FROM notifications where USER_ID=?;",
                values: [user_id]
            }, (err, results, fields) => {
                
                if(err){
                    return reject(err);
                }

                if(!results || results.length === 0){
                    //wtf
                    var err = new Error("User does not exist!");
                    err.errno = 1404;
                    err.code = "NOT FOUND";
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const newNotification = await getNotificationsByUserCMD;
            return new Result(newNotification, null);

        } catch(e) {
            switch(e.errno) {
                // duplicate entry
                case 1404: {
                    return new Result(
                        null,
                        new IError(
                            `Error ${ERROR_CODES.DATABASE.NOT_FOUND.TXT}.`,
                            ERROR_CODES.DATABASE.NOT_FOUND.NUM
                        ));
                }
            }


            return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
        
        } 
    }

}
module.exports = MySQLNotificationService;