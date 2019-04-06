import {Router, Request, Response} from 'express';
import Server from '../classes/server';

const router = Router();

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

export default router; 