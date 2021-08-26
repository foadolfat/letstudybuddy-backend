const ERROR_CODES = {
    DATABASE: {
        DUPLICATE:{
            NUM: 1000,
            TXT:"DUPLICATE"
        },
        NOT_FOUND:{
            NUM: 1404,
            TXT:"NOT FOUND"
        },
        NO_REFERENCE:{
            NUM: 1452,
            TXT:"FK CONSTRAINT FAILED"
        },
        MALFORMED_SYNTAX:{
            NUM: 1666,
            TXT:"SQL SYNTAX INCORRECT"
        }
    }
};

module.exports = ERROR_CODES;