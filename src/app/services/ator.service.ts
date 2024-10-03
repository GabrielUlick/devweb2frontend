import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { Ator } from "../models/ator";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class AtorService {
    apiUrl = `${environment.apiUrl}/ator`

    constructor(private http: HttpClient) { }

    listar(): Observable<Ator[]> {
        return this.http.get<Ator[]>(this.apiUrl);
    }

    cadastrar(ator: Omit<Ator, 'id'>): Observable<any> {
        return this.http.post(this.apiUrl, ator);
    }

    atualizar(ator: Ator): Observable<any> {
        return this.http.put(`${this.apiUrl}/${ator.id}`, ator);
    }

    remover(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}