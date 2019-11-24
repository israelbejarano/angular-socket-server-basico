import {Router, Request, Response} from 'express';
import Server from '../classes/server';
import { usuariosConectados, mapaMapbox } from '../sockets/socket';
import { GraficaData } from '../classes/grafica';
import { EncuestaData} from '../classes/encuesta';
import { Mapa } from '../classes/mapa';

const router = Router();

// Parte de mapas con Mapbox
router.get('/mapbox/mapa', (req: Request, res: Response) => {
    res.json(mapaMapbox.getMarcadores());
});









// FIN mapas con Mapbox

const grafica = new GraficaData();
const encuesta = new EncuestaData();
export const mapa = new Mapa();
const lugares = [
    {
      id: '1',
      nombre: 'Udemy',
      lat: 37.784679,
      lng: -122.395936
    },
    {
      id: '2',
      nombre: 'Bahía de San Francisco',
      lat: 37.798933,
      lng: -122.377732
    },
    {
      id: '3',
      nombre: 'The Palace Hotel',
      lat: 37.788578,
      lng: -122.401745
    }
];
mapa.marcadores.push(... lugares);

router.get('/mapa', (req: Request, res: Response) => {
    res.json(mapa.getMarcadores());
});


router.get('/mensajes', (req: Request, res: Response) => {
    res.json({
        ok: true,
        mensaje: 'todo esta bien'
    });
});

router.post('/mensajes', (req: Request, res: Response) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const payload = {
        de,
        cuerpo
    };
    const server = Server.instance
    server.io.emit('mensaje-nuevo', payload);
    res.json({
        ok: true,
        cuerpo,
        de
    });
});

router.post('/mensajes/:id', (req: Request, res: Response) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;

    const payload = {
        de,
        cuerpo
    };
    const server = Server.instance;
    // por defecto los sockets tienen una sala global y una sala por cada id
    // por eso puedo hacer el in a la sala id y es un mensaje privado
    server.io.in(id).emit('mensaje-privado', payload);
    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });
});

// servicio para obtener los ids de los usuarios
router.get('/usuarios', (req: Request, res: Response) => {
    const server = Server.instance;
    //io.clients devuelve el id de los usuarios conectados
    server.io.clients((err: any, clientes: string[]) => {
        if (err) {
            return res.json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            clientes
        });
    });
});

// obtener usuarios y nombres
router.get('/usuarios/detalle', (req: Request, res: Response) => {

    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    });
});

// obtener grafica
router.get('/grafica', (req: Request, res: Response) => {
    res.json(grafica.getDataGrafica());
});

// modificar valores de la grafica
router.post('/grafica', (req: Request, res: Response) => {
    const mes = req.body.mes;
    const unidades = Number(req.body.unidades);

    grafica.incrementarValor(mes, unidades)

    const server = Server.instance
    server.io.emit('cambio-grafica', grafica.getDataGrafica());
    res.json(grafica.getDataGrafica());
});

// obtener encuesta
router.get('/encuesta', (req: Request, res: Response) => {
    res.json(encuesta.getDataEncuesta());
});

// modificar valores de la encuesta
router.post('/encuesta', (req: Request, res: Response) => {
    const opcion = Number(req.body.opcion);
    const unidades = Number(req.body.unidades);

    encuesta.incrementarValor(opcion, unidades)

    const server = Server.instance
    server.io.emit('cambio-encuesta', encuesta.getDataEncuesta());
    res.json(encuesta.getDataEncuesta());
});

export default router; 