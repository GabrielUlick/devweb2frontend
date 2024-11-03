import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environments";
import { Dependente } from "../models/dependente";

@Injectable({
    providedIn: 'root'
})
export class DependenteService {
    apiUrl = `${environment.apiUrl}/dependente`

    constructor(private http: HttpClient) { }

    listar(): Observable<Dependente[]> {
        return this.http.get<Dependente[]>(this.apiUrl);
    }

    cadastrar(dependente: Omit<Dependente, 'id'>): Observable<any> {
        return this.http.post(this.apiUrl, dependente);
    }

    atualizar(dependente: Dependente): Observable<any> {
        return this.http.put(`${this.apiUrl}/${dependente.id}`, dependente);
    }

    remover(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}