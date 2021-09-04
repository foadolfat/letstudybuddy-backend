const ERROR_CODES = require("../errors");
const { Result, IError } = require("../Result");
const SocketService = require("../SocketService");

class MySQLSocketService extends SocketService {

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
     * @param {number} user_id
     * @param {string} socket_id
     * @returns {Promise<Result<import("../SocketService").Socket>>} 
     */
    async createSocket(user_id, socket_id) {
        const createSocketCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "INSERT INTO sockets (USER_ID, SOCKET_ID) VALUES(?,?) ON DUPLICATE KEY UPDATE socket_id=?;",
                values:[user_id, socket_id, socket_id]
            },
            (err, results, fields) => {

                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            await createSocketCMD;
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
        return this.getSocket(user_id);
        
    }

    /**
     * @param {number} user_id
     * @param {string} socket_id
     * @returns {Promise<Result<boolean>>}
     */
     async deleteSocket(user_id, socket_id) {
        const deleteSocketCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM sockets WHERE USER_ID=? and SOCKET_ID=?;",
                values:[user_id, socket_id]
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
            const results = await deleteSocketCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);

        } catch(e) {


			console.log(e.code, e.errno);

			return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
    }
    

    /**
     * @param {number} user_id
     * @param {string} socket_id
     * @returns {Promise<Result<import("../SocketService").Socket>>} 
     */
     async updateSocket(socket_id, user_id) {
        const updateSocketCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "UPDATE sockets SET SOCKET_ID=? WHERE USER_ID=?;",
                values:[ socket_id, user_id]
            },
            (err, results, fields) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            await updateSocketCMD;
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
        return this.getSocket(user_id);
        
        
    }

    /**
     * @param {number} user_id
     * @returns {Promise<Result<import("../SocketService").Socket>>} 
     */
    async getSocket(user_id){
        /**
         * @type {Promise<import("../SocketService").Socket>}
         */
         const getSocketCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT * FROM sockets WHERE USER_ID=?;",
                values: [user_id]
            }, (err, results, fields) => {
                connection.release();
                if(err){
                    return reject(err);
                }

                if(!results || results.length === 0){
                    //wtf
                    var err = new Error("Socket does not exist!");
                    err.errno = 1404;
                    err.code = "NOT FOUND";
                    return reject(err);
                }
                resolve(results[0]);
            });
        });
        try{
            const newSocket = await getSocketCMD;
            return new Result(newSocket, null);

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

module.exports = MySQLSocketService;

