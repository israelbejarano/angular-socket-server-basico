import Server from "./classes/server";
import router from "./routes/router";
import bodyParse from 'body-parser';

const server = new Server();
// body parser
server.app.use(bodyParse.urlencoded({extended: true}));
server.app.use(bodyParse.json());
server.app.use('/', router);

server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});