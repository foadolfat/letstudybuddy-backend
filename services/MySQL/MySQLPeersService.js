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

//select p.user_id from peers as p, peers as u where p.user_id=u.peer_id and u.user_id=50; 
/**
     * @param {number} user_id
     * @returns {Promise<Result<import("../PeersService").Peer>>} 
     */
    async getPeers(user_id){
        /**
         * @type {Promise<import("../PeersService").Peer>}
         */
        const getPeerCMD = new Promise((resolve, reject) => {
//"SELECT DISTINCT p.USER_ID, r.USERNAME FROM USERS AS r, PEERS AS p, PEERS AS u WHERE u.USER_ID=p.PEER_ID AND u.USER_ID=? AND r.USER_ID=p.USER_ID AND r.USER_ID!=?;"
            this.connection.query({
                sql:`select 
                        u.username as USERNAME, r2.USER_ID as PEER_ID, r2.room_id as ROOM_ID
                    from 
                        users as u, room_members as r2 
                    where 
                        u.user_id=r2.user_id and r2.user_id!=? and r2.room_id 
                    in 
                        (select 
                            r.room_id 
                        from 
                            room_members as r 
                        where 
                            r.user_id=?);`,
                values: [user_id, user_id]
            }, (err, results, fields) => {
                connection.release();
                if(err){
                    return reject(err);
                }

                if(!results || results.length === 0){
                    //wtf
                    var err = new Error("Peers do not exist!");
                    err.errno = 1404;
                    err.code = "NOT FOUND";
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const peer = await getPeerCMD;
            return new Result(peer, null);

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
                connection.release();
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
                connection.release();
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