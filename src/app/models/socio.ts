import { Cliente } from "./cliente";

export interface Socio extends Cliente {
    cpf: string;
    endereco: string;
    telefone: string;
}