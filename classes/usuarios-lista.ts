import { Usuario } from "./usuario";

export class UsuariosLista {
    private lista: Usuario[] = [];

    constructor() {}

    // agregar usuario
    public agregar(usuario: Usuario) {
        this.lista.push(usuario);
        console.log(this.lista);
        return usuario;
    }

    // actualizar nombre de usuario
    public actualizarNombre(id: string, nombre: string) {
        for (let usuario of this.lista) {
            if( usuario.id === id) {
                usuario.nombre = nombre;
                break;
            }
        }
        console.log('========== actualizando usuario ==========');
        console.log(this.lista);
    }

    // obtener lista de usuarios
    public getLista() {
        return this.lista.filter(usuario => usuario.nombre !== 'sin-nombre');
    }

    // obtener usuario
    public getUsuario(id: string) {
        return this.lista.find(usuario => usuario.id === id);
    }

    // obtener todos los usuarios de una sala
    public getUsuariosSala(sala: string) {
        return this.lista.filter(usuario => usuario.sala === sala);
    }

    // borrar usuario
    public borrarUsuario(id: string) {
        const tempUsuario = this.getUsuario(id);
        this.lista = this.lista.filter(usuario => {usuario.id !== id});
        return tempUsuario;
    }
}