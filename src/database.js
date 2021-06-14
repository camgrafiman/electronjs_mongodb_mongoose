/* Conexión con MongoDB a través de Mongoose. */
const mongoose = require("mongoose");

const configuracion_entorno = require("./configuracion_entorno");

console.log(configuracion_entorno.HOST);
console.log(configuracion_entorno.PORT);

mongoose.connect(configuracion_entorno.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(database => console.log("========DATABASE===== La base de datos esta conectada. =) ======================"))
    .catch(err => console.error("No se ha podido acceder a la base de datos. error: ", err))