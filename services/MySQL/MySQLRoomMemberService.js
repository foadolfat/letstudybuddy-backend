const ERROR_CODES = require("../errors");
const { Result, IError } = require("../Result");
const RoomMemberService = require("../RoomMemberService");

class MySQLRoomMemberService extends RoomMemberService {

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
     * @param {import("../RoomMemberService").RoomMemberDTO} roomMemberDTO
     * @returns {Promise<Result<import("../RoomMemberService").RoomMember>>} 
     */
    async createRoomMember(roomMemberDTO) {
        const createRoomMemberCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "INSERT INTO room_members (ROOM_ID, USER_ID) VALUES(?,?);",
                values:[roomMemberDTO.room_id, roomMemberDTO.user_id]
            },
            (err, results, fields) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            await createRoomMemberCMD;
            //console.log("id is ",newRoomMember)
            //return new Result(newRoomMember, null)
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
        return this.getRoomMember(roomMemberDTO);
        
    }

    /**
     * @param {import("../RoomMemberService").RoomMemberDTO} roomMemberDTO
     * @returns {Promise<Result<boolean>>}
     */
     async deleteRoomMember(roomMemberDTO) {
        const deleteRoomMemberCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM room_members WHERE ROOM_ID=? AND USER_ID=?;",
                values:[roomMemberDTO.room_id, roomMemberDTO.user_id]
            },
            (err, results, fields) => {
                if(err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
        try{
            const results = await deleteRoomMemberCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);

        } catch(e) {


			console.log(e.code, e.errno);

			return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
    }
    

    /**
     * @param {import("../RoomMemberService").RoomMemberDTO} roomMemberDTO
     * @returns {Promise<Result<import("../RoomMemberService").RoomMember>>} 
     */
     async updateRoomMember(roomMemberDTO) {
        const updateRoomMemberCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "UPDATE room_members SET  WHERE ROOM_ID=? AND USER_ID=?;",
                values:[ roomMemberDTO.room_id, roomMemberDTO.user_id ]
            },
            (err, results, fields) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            await updateRoomMemberCMD;
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
        return this.getRoomMember(roomMemberDTO);
        
        
    }

    /**
     * @param {import("../RoomMemberService").RoomMemberDTO} roomMemberDTO
     * @returns {Promise<Result<import("../RoomMemberService").RoomMember>>} 
     */
    async getRoomMember(roomMemberDTO){
        /**
         * @type {Promise<import("../RoomMemberService").RoomMember>}
         */
         const getRoomMemberCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT * FROM room_members WHERE ROOM_ID=? AND USER_ID=?;",
                values: [roomMemberDTO.room_id, roomMemberDTO.user_id]
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
            const roomMember = await getRoomMemberCMD;
            return new Result(roomMember, null);

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
     * @param {number} user_id
     * @returns {Promise<Result<import("../RoomMemberService").RoomMember>>} 
     */
    async getRoomsAndMembers(user_id){
        const getRoomsAndMembersCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"select u.username, r2.user_id, r2.room_id from users as u, room_members as r2 where u.user_id=r2.user_id and r2.user_id!=1 and r2.room_id in (select r.room_id from room_members as r where r.user_id=1);",
                values: [user_id]
            }, (err, results, fields) => {
                if(err){
                    return reject(err);
                }

                if(!results || results.length === 0){
                    //wtf
                    var err = new Error("No friends found");
                    err.errno = 1404;
                    err.code = "NOT FOUND";
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const roomsAndMembers = await getRoomsAndMembersCMD;
            return new Result(roomsAndMembers, null);

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
     * @param {number} user_id
     * @param {number} peer_id
     * @returns {Promise<Result<boolean>>} 
     */
     async checkForCommonRoom(user_id, peer_id) {
        const checkForCommonRoomCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "SELECT r1.room_id FROM room_members AS r1, room_members AS r2 WHERE r1.user_id=? AND r2.user_id=? AND r1.room_id=r2.room_id;",
                values:[ user_id, peer_id ]
            },
            (err, results, fields) => {
                if(err) {
                    return reject(err);
                }
                console.log("sql1 ",results);
                resolve(results);
            });
        });
        try{
            
            const result = await checkForCommonRoomCMD;
            console.log("sql ",result[0]);
            if(!result || result.length === 0) return new Result(false, null);
            else return new Result(true, null);
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

};

module.exports = MySQLRoomMemberService;

