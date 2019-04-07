import {Router, Request, Response} from 'express';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/socket';
import { GraficaData } from '../classes/grafica';

const router = Router();
const grafica = new GraficaData();

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

export default router; 