import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Item } from "../models/item";

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    apiUrl = `${environment.apiUrl}/item`

    constructor(private http: HttpClient) { }

    listar(): Observable<Item[]> {
        return this.http.get<Item[]>(this.apiUrl);
    }

    cadastrar(item: Omit<Item, 'id'>): Observable<any> {
        return this.http.post(this.apiUrl, item);
    }

    atualizar(item: Item): Observable<any> {
        return this.http.put(`${this.apiUrl}/${item.id}`, item);
    }

    remover(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}