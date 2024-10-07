import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environments";
import { Diretor } from "../models/diretor";

@Injectable({
    providedIn: 'root'
})
export class DiretorService {
    apiUrl = `${environment.apiUrl}/diretor`

    constructor(private http: HttpClient) { }

    listar(): Observable<Diretor[]> {
        return this.http.get<Diretor[]>(this.apiUrl);
    }

    cadastrar(diretor: Omit<Diretor, 'id'>): Observable<any> {
        return this.http.post(this.apiUrl, diretor);
    }

    atualizar(diretor: Diretor): Observable<any> {
        return this.http.put(`${this.apiUrl}/${diretor.id}`, diretor);
    }

    remover(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}