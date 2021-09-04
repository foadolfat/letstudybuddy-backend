const ERROR_CODES = require("../errors");
const { Result, IError } = require("../Result");
const MessagesService = require("../MessagesService");

class MySQLMessagesService extends MessagesService {

    /**
     * @param {import("mysql").Connection} connection
     */
    constructor(connection) {
        super();
        /**
         * @private
         * @type {import("mysql").Connection}
         */
        this.connection = connection;
    }


    /**
     * @param {import("../MessagesService").MessageDTO} messageDTO
     * @param {number} user_id
     * @returns {Promise<Result<boolean>>}
     */
    async createMessage(messageDTO, user_id) {
        const createMessageCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "INSERT INTO messages (ROOM_ID, USER_ID, CONTENT) VALUES(?,?,?);",
                values:[messageDTO.room_id, user_id, messageDTO.content]
            },
            (err, results, fields) => {
                connection.release();
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const newMessage = await createMessageCMD;
            //console.log(messageDTO.room_id, user_id, messageDTO.content)
            if(newMessage.affectedRows > 0) return new Result(true, null)
            else return new Result(false, null)
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
        
    }

    /**
     * @param {import("../MessagesService").MessageDTO} messageDTO
     * @param {number} user_id
     * @returns {Promise<Result<boolean>>}
     */
     async deleteMessage(messageDTO, user_id) {
        const deleteMessageCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM messages WHERE ROOM_ID=? and USER_ID=? and DATE_SENT=?;",
                values:[messageDTO.room_id, user_id, messageDTO.date_sent]
            },
            (err, results, fields) => {
                connection.release();
                if(err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
        try{
            const results = await deleteMessageCMD;
            if(results.affectedRows > 0) return new Result(true, null);
            else return new Result(false, null);

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
    }

    /**
     * @param {import("../MessagesService").MessageDTO} messageDTO
     * @param {number} user_id
     * @returns {Promise<Result<boolean>>}
     */
     async deleteMessages(messageDTO, user_id) {
        const deleteMessagesCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM messages WHERE ROOM_ID=? and USER_ID=?;",
                values:[messageDTO.room_id, user_id]
            },
            (err, results, fields) => {
                connection.release();
                if(err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
        try{
            const results = await deleteMessagesCMD;
            if(results.affectedRows > 0) return new Result(true, null);
            else return new Result(false, null);

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
    }
    

    /**
     * @param {import("../MessagesService").MessageDTO} messageDTO
     * @param {number} user_id
     * @returns {Promise<Result<boolean>>}
     */
     async updateMessage(messageDTO, user_id) {
        const updateMessageCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "UPDATE messages SET CONTENT=? WHERE ROOM_ID=? and USER_ID=? and DATE_SENT=?;",
                values:[ messageDTO.content, messageDTO.room_id, messageDTO.user_id, messageDTO.date_sent ]
            },
            (err, results, fields) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            await updateMessageCMD;
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
        return this.getMessage(roomDTO.room_id);
        
        
    }

    /**
     * @param {import("../MessagesService").MessageDTO} messageDTO
     * @param {number} user_id
     * @returns {Promise<Result<import("../MessagesService").Message>>} 
     */
    async getUserMessages(messageDTO, user_id){
        /**
         * @type {Promise<import("../MessagesService").Message>}
         */
         const getUserMessagesCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT * FROM rooms WHERE room_id=? and user_id=?;",
                values: [messageDTO.room_id, user_id]
            }, (err, results, fields) => {
                connection.release();
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
            const messages = await getUserMessagesCMD;
            return new Result(messages, null);

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
     * @param {import("../MessagesService").MessageDTO} messageDTO
     * @returns {Promise<Result<import("../MessagesService").Message>>} 
     */
     async getRoomMessages(messageDTO){
        /**
         * @type {Promise<import("../MessagesService").Message>}
         */
         const getRoomMessagesCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT u.username, u.user_id as message_user_id, m.content, m.date_sent FROM users AS u, messages AS m WHERE m.user_id=u.user_id AND m.room_id=? ORDER BY date_sent ASC;",
                values: [messageDTO.room_id]
            }, (err, results, fields) => {
                connection.release();
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
                //console.log(results)
                resolve(results);
            });
        });
        try{
            const messages = await getRoomMessagesCMD;
            return new Result(messages, null);

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

};

module.exports = MySQLMessagesService;

