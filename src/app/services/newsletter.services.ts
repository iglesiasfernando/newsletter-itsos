import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { Config } from '../model/config.interface';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class NewsletterService {
  configUrl : string = environment.config;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };
  constructor(private http: HttpClient) {

   }
   getConfig() {
        return this.http.get<Config>(this.configUrl);
  }

  async sendNewsLetter(mailParams : any): Promise<any> {
    let config = await this.getConfig().toPromise();
    return await this.http.post<any>(config.apiUrl + '/newsletter', JSON.stringify(mailParams), this.httpOptions).toPromise();
    
  }  

 // Error handling 
 handleError(error : any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
 }

}