import { Ator } from "./ator";
import { Classe } from "./classe";
import { Diretor } from "./diretor";

export interface Titulo {
    id: string;
    nome: string;
    sinopse: string;
    categoria: string;
    ator: Ator;
    diretor: Diretor;
    classe: Classe;
}