const jwt = require("jwt-simple");
const moment = require("moment");

const secret = "Secret_Key_from_FreePlace_project_022506";

const createToken = (driver) => {
    const payLoad = {
        id: driver._id,
        name: driver.name,
        lastName: driver.lastName,
        email: driver.email,
        idNumber: driver.idNumber,
        idType: driver.idType,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    };

    return jwt.encode(payLoad, secret);
}

module.exports = {
    secret,
    createToken
}