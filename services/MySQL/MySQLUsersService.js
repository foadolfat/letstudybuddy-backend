const ERROR_CODES = require("../errors");
const { Result, IError } = require("../Result");
const UsersService = require("../UsersService");

class MySQLUsersService extends UsersService {

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
     * @param {import("../UsersService").UserDTO} userDTO
     * @returns {Promise<Result<import("../UsersService").User>>} 
     */
    async createUser(userDTO, password) {
        const createUserCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "INSERT INTO users (USERNAME, FNAME, LNAME, EMAIL, PASS, MAJOR, IMG, GPA, DEGREE) VALUES(?,?,?,?,?,?,?,?,?);",
                values:[userDTO.username, userDTO.fName, userDTO.lName, userDTO.email, password, userDTO.major, userDTO.img, userDTO.gpa, userDTO.degree]
            },
            (err, results, fields) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            await createUserCMD;
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
        return this.getUser(null, userDTO.username, null);
        
    }

    /**
     * @param {number} user_id
     * @returns {Promise<Result<boolean>>}
     */
     async deleteUser(user_id) {
        const deleteUserCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM users WHERE USER_ID=?;",
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
            const results = await deleteUserCMD;
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
     * @param {import("../UsersService").UserDTO} userDTO
     * @param {number} user_id
     * @returns {Promise<Result<import("../UsersService").User>>} 
     */
     async updateUser(userDTO, user_id) {
        const updateUserCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "UPDATE users SET USERNAME=? FNAME=?, LNAME=?, MAJOR=?, DEGREE=?, GPA=? WHERE USER_ID=?;",
                values:[userDTO.username, userDTO.fName, userDTO.lName, userDTO.major, userDTO.degree, userDTO.gpa, user_id]
            },
            (err, results, fields) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            await updateUserCMD;
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
        return this.getUser(user_id, null, null);
        
        
    }

    async getUser(user_id, username, email){
        /**
         * @type {Promise<import("../UsersService").User>}
         */
         const getUserCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT *, CAST(PASS as CHAR) as PASS FROM users WHERE user_id=? OR username=? OR email=?;",
                values: [user_id, username, email]
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
            const newUser = await getUserCMD;
            return new Result(newUser, null);

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

module.exports = MySQLUsersService;

