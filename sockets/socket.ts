import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { MarcadorMapbox } from '../classes/marcadorMapbox';
import { MapaMapbox } from '../classes/mapaMapbox';
import { Usuario } from '../classes/usuario';
import { mapa } from '../routes/router';

export const usuariosConectados = new UsuariosLista();
export const mapaMapbox = new MapaMapbox();

// conectar cliente
export const conectarCliente = (cliente: Socket, io: socketIO.Server) => {
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregar(usuario);
}

// desconectar cliente
export const desconectar = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos', usuariosConectados.getLista());
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
        usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
        io.emit('usuarios-activos', usuariosConectados.getLista());
        callback({
            ok: true,
            mensaje: `usuario ${payload.nombre}, configurado`
        });
    });
}

// obtener usuarios
export const obtenerUsuarios = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('obtener-usuarios', () => {
        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista());
    });
}

// mapas
export const nuevoMarcador = (cliente: Socket) => {
    cliente.on('nuevo-marcador', (marcador) => {
        console.log(marcador);
        mapa.agregarMarcador(marcador);
        cliente.broadcast.emit('nuevo-marcador', marcador);
    });
}

export const borrarMarcador = (cliente: Socket) => {
    cliente.on('marcador-borrar', (id: string) => {
        console.log(id);
        mapa.borrarMarcador(id);
        cliente.broadcast.emit('marcador-borrar', id);
    });
}

export const moverMarcador = (cliente: Socket) => {
    cliente.on('mover-marcador', (marcador) => {
        console.log(marcador);
        mapa.moverMarcador(marcador);
        cliente.broadcast.emit('mover-marcador', marcador);
    });
}

// mapbox mapas
export const mapboxMapasSockets = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mb-marcador-nuevo', (marcador: MarcadorMapbox) => {
        mapaMapbox.agregarMarcador(marcador);
        cliente.broadcast.emit('mb-marcador-nuevo', marcador);
    });

    cliente.on('mb-marcador-borrar', (id: string) => {
        mapaMapbox.borrarMarcador(id);
        cliente.broadcast.emit('mb-marcador-borrar', id);
    });
}