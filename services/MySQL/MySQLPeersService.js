const ERROR_CODES = require("../errors");
const { Result, IError } = require("../Result");
const PeersService = require("../PeersService");



class MySQLPeerssService extends PeersService {
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
     * @param {string} peer_id
     * @returns {Promise<Result<import("../PeersService").Peer>>} 
     */
     async getPeer(user_id, peer_id){
        /**
         * @type {Promise<import("../PeersService").Peer>}
         */
         const getPeerCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT * FROM PEERS WHERE USER_ID=? AND PEER_ID=?;",
                values: [user_id, peer_id]
            }, (err, results, fields) => {
                if(err){
                    return reject(err);
                }

                if(!results || results.length === 0){
                    //wtf
                    var err = new Error("Peer does not exist!");
                    err.errno = 1404;
                    err.code = "NOT FOUND";
                    return reject(err);
                }
                resolve(results[0]);
            });
        });
        try{
            const newPeer = await getPeerCMD;
            return new Result(newPeer, null);

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
                case 1452: {
                    return new Result(
                        null,
                        new IError(
                            `Error ${ERROR_CODES.DATABASE.NO_REFERENCE.TXT}.`,
                            ERROR_CODES.DATABASE.NO_REFERENCE.NUM
                        ));
                }
            }

            console.log(e.code, e.errno);

            return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
    }


    /**
     * @param {import("../PeersService").CLassDTO} peerDTO
     * @param {number} user_id
     * @param {number} peer_id
     * @returns {Promise<Result<import("../PeersService").Peer>>} 
     */
    async createPeer(peerDTO, user_id, peer_id) {
        const createPeerCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "INSERT INTO PEERS (USER_ID, PEER_ID, LIKED) VALUES(?,?,?);",
                values:[user_id, peer_id, peerDTO.liked]
            },
            (err, results, fields) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            await createPeerCMD;
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
                case 1452: {
                    return new Result(
                        null,
                        new IError(
                            `Error ${ERROR_CODES.DATABASE.NO_REFERENCE.TXT}.`,
                            ERROR_CODES.DATABASE.NO_REFERENCE.NUM
                        ));
                }
			}

			return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
        return this.getPeer(user_id, peer_id);
        
    }

    async deletePeer(user_id, peer_id) {
        const deletePeerCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM PEERS WHERE USER_ID=? AND PEER_ID=?;",
                values:[user_id, peer_id]
            },
            (err, results, fields) => {
                if(err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
        try{
            const results = await deletePeerCMD;
            if(results.affectedRows>0) return new Result(true, null);
            else return new Result(false, null);

        } catch(e) {

            // switch(e.errno) {
			// 	// duplicate entry
			// 	case 1062: {
			// 		return new Result(
			// 			null,
			// 			new IError(
			// 				`Error ${ERROR_CODES.DATABASE.DUPLICATE.TXT}.`,
			// 				ERROR_CODES.DATABASE.DUPLICATE.NUM
			// 			));
			// 	}
			// }

			console.log(e.code, e.errno);

			return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
    }


    /**
     * @param {import("../PeersService").PeerDTO} peerDTO
     * @param {number} user_id
     * @param {number} peer_id
     * @returns {Promise<Result<import("../PeersService").Peer>>} 
     */
     async updatePeer(peerDTO, user_id, peer_id) {
        const updatePeerCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "UPDATE PEERS SET LIKED=? WHERE USER_ID=? AND PEER_ID=?;",
                values:[peerDTO.liked, user_id, peer_id]
            },
            (err, results, fields) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            await updatePeerCMD;
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
        return this.getPeer(user_id, peer_id);
        
        
    }

};

module.exports = MySQLPeerssService;