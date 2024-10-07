import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Classe } from "../models/classe";

@Injectable({
    providedIn: 'root'
})
export class ClasseService {
    apiUrl = `${environment.apiUrl}/classe`

    constructor(private http: HttpClient) { }

    listar(): Observable<Classe[]> {
        return this.http.get<Classe[]>(this.apiUrl);
    }

    cadastrar(classe: Omit<Classe, 'id'>): Observable<any> {
        return this.http.post(this.apiUrl, classe);
    }

    atualizar(classe: Classe): Observable<any> {
        return this.http.put(`${this.apiUrl}/${classe.id}`, classe);
    }

    remover(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}