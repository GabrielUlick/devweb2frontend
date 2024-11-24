import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environments";
import { Locacao } from "../models/locacao";

@Injectable({
    providedIn: 'root'
})
export class LocacaoService {
    apiUrl = `${environment.apiUrl}/locacao`

    constructor(private http: HttpClient) { }

    listar(): Observable<Locacao[]> {
        return this.http.get<Locacao[]>(this.apiUrl);
    }

    cadastrar(locacao: Omit<Locacao, 'id'>): Observable<any> {
        return this.http.post(this.apiUrl, locacao);
    }

    atualizar(locacao: Locacao): Observable<any> {
        return this.http.put(`${this.apiUrl}/${locacao.id}`, locacao);
    }

    remover(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    verificarItemDisponivel(id: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/verificarItemDisponivel/${id}`);
    }

}