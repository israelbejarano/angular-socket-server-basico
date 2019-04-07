
export class EncuestaData {

    private labels: string[] = [];
    private valores: number[] = [0, 0, 0, 0];

    constructor() { }

    setLabels( labels: string[] ) {
        this.labels = labels;
    }

    getDataEncuesta() {
        return [
            { data: this.valores, label: 'Preguntas' }
        ];
    }


    incrementarValor( opcion: number, valor: number ) {

        this.valores[opcion] += valor;
        return this.getDataEncuesta();

    }

}