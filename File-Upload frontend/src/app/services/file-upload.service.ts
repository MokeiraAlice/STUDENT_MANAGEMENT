import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = 'http://localhost:9000/api';
  
  constructor(private http: HttpClient) {}
  
  uploadFile(file: File, description: string, category: string): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);

    
    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    
    return this.http.request(req);
  }
  
  getFiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }
  
  getFile(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  
  deleteFile(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}