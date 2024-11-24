import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Cliente } from "../models/cliente";

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    apiUrl = `${environment.apiUrl}/api/clientes`

    constructor(private http: HttpClient) { }

    verificarPendencias(clienteId: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/${clienteId}/pendencias`);
    }

}