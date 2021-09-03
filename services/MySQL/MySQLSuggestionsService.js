const ERROR_CODES = require("../errors");
const { Result, IError } = require("../Result");
const SuggestionsService = require("../UsersService");

class MySQLSuggestionsService extends SuggestionsService {

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
         * @returns {Promise<Result<import("../SuggestionsService").Peer>>} 
         */
    async createSuggestion(user_id) {
        const createSuggestionCMD = new Promise((resolve, reject) => {
            var query = `select 
                            user_id as peer_id, username, fname, lname, major, degree, expected_grad , gpa
                        from
                            users 
                        where
                            user_id in
                            (
                                select 
                                    p.user_id
                                from 
                                    classes u, classes p 
                                where 
                                    u.user_id=? and p.user_id!=? and p.class_name=u.class_name and p.user_id not in (
                                        select 
                                            p.peer_id
                                        from 
                                            peers as p
                                        where 
                                            p.user_id=? and p.liked=?
                                    )
                            );` ;
            this.connection.query({
                sql:query,
                values:[user_id, user_id, user_id, true]
                },
            (err, results, fields) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        try{
            const newSuggestionsList = await createSuggestionCMD;
            return new Result(newSuggestionsList, null);
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
                case 1064: {
                    return new Result(
                        null,
                        new IError(
                            `Error ${ERROR_CODES.DATABASE.MALFORMED_SYNTAX.TXT}.`,
                            ERROR_CODES.DATABASE.MALFORMED_SYNTAX.NUM
                        ));
                }
            }

            console.log(e.code, e.errno);

            return new IError(`Unhandled error ${e.code} - ${e.errno}`, e.errno);
            
        }
        
    }

}

module.exports = MySQLSuggestionsService;




