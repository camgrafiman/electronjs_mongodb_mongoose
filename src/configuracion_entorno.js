const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV || "Desarrollo local",
    HOST: process.env.HOST || "127.0.0.1",
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || ""
}