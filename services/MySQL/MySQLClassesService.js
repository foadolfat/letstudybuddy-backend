const ERROR_CODES = require("../errors");
const { Result, IError } = require("../Result");
const ClassesService = require("../ClassesService");



class MySQLClassessService extends ClassesService {
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
     * @param {string} class_name
     * @param {string} school
     * @returns {Promise<Result<import("../ClassesService").Class>>} 
     */
     async getClasses(user_id){
        /**
         * @type {Promise<import("../ClassesService").Class>}
         */
         const getClassesCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql:"SELECT * FROM CLASSES WHERE USER_ID=?;",
                values: [user_id]
            }, (err, results, fields) => {
                connection.release();
                if(err){
                    return reject(err);
                }

                if(!results || results.length === 0){
                    //wtf
                    var err = new Error("Class does not exist!");
                    err.errno = 1404;
                    err.code = "NOT FOUND";
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const newClass = await getClassesCMD;
            return new Result(newClass, null);

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
     * @param {import("../ClassesService").CLassDTO} classDTO
     * @param {number} user_id
     * @returns {Promise<Result<import("../ClassesService").Class>>} 
     */
    async createClass(classDTO, user_id) {
        const createClassCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "INSERT INTO CLASSES (USER_ID, CLASS_NAME, SCHOOL, EXPECTED_END, PROF) VALUES(?,?,?,?,?);",
                values:[user_id, classDTO.class_name, classDTO.school, classDTO.expected_end, classDTO.prof]
            },
            (err, results, fields) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            await createClassCMD;
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
        return this.getClasses(user_id);
        
    }

    async deleteClass(user_id, class_name, school) {
        const deleteClassCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "DELETE FROM CLASSES WHERE USER_ID=? AND CLASS_NAME=? AND SCHOOL=?;",
                values:[user_id, class_name, school]
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
            const results = await deleteClassCMD;
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
     * @param {import("../ClassesService").ClassDTO} classDTO
     * @param {number} user_id
     * @returns {Promise<Result<import("../ClassesService").Class>>} 
     */
     async updateClass(classDTO, user_id) {
        const updateClassCMD = new Promise((resolve, reject) => {
            this.connection.query({
                sql: "UPDATE CLASSES SET  EXPECTED_END=? , PROF=?  WHERE USER_ID=? AND CLASS_NAME=? AND SCHOOL=?;",
                values:[classDTO.expected_end, classDTO.prof, user_id, classDTO.class_name, classDTO.school]
            },
            (err, results, fields) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            await updateClassCMD;
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
        return this.getClasses(user_id);
        
        
    }

};

module.exports = MySQLClassessService;