const ERROR_CODES = require("../errors");
const { Result, IError } = require("../Result");
const RoomsService = require("../RoomsService");

class MySQLRoomsService extends RoomsService {

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
     * @returns {Promise<Result<import("../RoomsService").Room>>} 
     */
    async createRoom() {
        const createRoomCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "INSERT INTO rooms VALUES();"
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
            const newRoom = await createRoomCMD;
            //console.log("id is ",newRoom)
            return new Result(newRoom, null)
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
     * @param {number} room_id
     * @returns {Promise<Result<boolean>>}
     */
     async deleteRoom(room_id) {
        const deleteRoomCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM rooms WHERE ROOM_ID=?;",
                values:[room_id]
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
            const results = await deleteRoomCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);

        } catch(e) {


			console.log(e.code, e.errno);

			return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
    }
    

    /**
     * @param {import("../RoomsService").RoomDTO} roomDTO
     * @returns {Promise<Result<import("../RoomsService").Room>>} 
     */
     async updateRoom(roomDTO) {
        const updateRoomCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "UPDATE users SET  WHERE ROOM_ID=?;",
                values:[ roomDTO.room_id ]
            },
            (err, results, fields) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            await updateRoomCMD;
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
        return this.getRoom(roomDTO.room_id);
        
        
    }

    /**
     * @param {number} room_id
     * @returns {Promise<Result<import("../RoomsService").Room>>} 
     */
    async getRoom(room_id){
        /**
         * @type {Promise<import("../RoomsService").Room>}
         */
         const getRoomCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT * FROM rooms WHERE room_id=?;",
                values: [room_id]
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
                resolve(results[0]);
            });
        });
        try{
            const room = await getRoomCMD;
            return new Result(room, null);

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

module.exports = MySQLRoomsService;

