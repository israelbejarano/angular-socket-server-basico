import { Socket } from 'socket.io';
import socketIO from 'socket.io';

// desconectar cliente
export const desconectar = (cliente: Socket) => {
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
}

// escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', (payload: {de: string, cuerpo: string}) => {
        console.log('mensaje recibido', payload);

        io.emit('mensaje-nuevo', payload);
    });
}

// configurar usuario
export const configurarUsuario = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('configurar-usuario', (payload: {nombre: string}, callback: Function) => {
        console.log('configurando usuario ', payload.nombre);
        callback({
            ok: true,
            mensaje: `usuario ${payload.nombre}, configurado`
        });
    });
}