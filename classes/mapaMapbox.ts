import { MarcadorMapbox } from './marcadorMapbox';

export class MapaMapbox {
    
    private marcadores: {[key: string]: MarcadorMapbox} = {}
    
    constructor() {}

    getMarcadores() {
        return this.marcadores;
    }

    borrarMarcador(id: string) {
        delete this.marcadores[id];
        return this.getMarcadores();
    }

    moverMarcador(marcador: MarcadorMapbox) {
        this.marcadores[marcador.id].lng = marcador.lng;
        this.marcadores[marcador.id].lat = marcador.lat;
    }
}