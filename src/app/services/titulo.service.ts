import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environments";
import { Titulo } from "../models/titulo";

@Injectable({
    providedIn: 'root'
})
export class TituloService {
    apiUrl = `${environment.apiUrl}/titulo`

    constructor(private http: HttpClient) { }

    listar(): Observable<Titulo[]> {
        return this.http.get<Titulo[]>(this.apiUrl);
    }

    cadastrar(titulo: Omit<Titulo, 'id'>): Observable<any> {
        return this.http.post(this.apiUrl, titulo);
    }

    atualizar(titulo: Titulo): Observable<any> {
        return this.http.put(`${this.apiUrl}/${titulo.id}`, titulo);
    }

    remover(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}