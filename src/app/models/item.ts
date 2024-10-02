import { Titulo } from "./titulo";

export interface Item {
    id: string;
    numSerie: string;
    dtAquisicao: Date;
    tipoItem: string;
    titulo: Titulo
}