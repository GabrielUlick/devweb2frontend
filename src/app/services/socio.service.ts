import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environments";
import { Socio } from "../models/socio";

@Injectable({
    providedIn: 'root'
})
export class SocioService {
    apiUrl = `${environment.apiUrl}/socio`

    constructor(private http: HttpClient) { }

    listar(): Observable<Socio[]> {
        return this.http.get<Socio[]>(this.apiUrl);
    }

    cadastrar(socio: Omit<Socio, 'id'>): Observable<any> {
        return this.http.post(this.apiUrl, socio);
    }

    atualizar(socio: Socio): Observable<any> {
        return this.http.put(`${this.apiUrl}/${socio.id}`, socio);
    }

    remover(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}