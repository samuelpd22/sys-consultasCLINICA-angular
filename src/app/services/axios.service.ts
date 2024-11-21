import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AxiosService {

  constructor() {
    axios.defaults.baseURL = 'http://localhost:8080';
    axios.defaults.headers.post['Content-Type'] = 'application/json';
  }

  getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem("auth_token");
  }
  return null; // ou lance um erro, dependendo da lógica que você quer
}

  setAuthToken(token: string | null): void {
    if (typeof window !== 'undefined') {
      if (token !== null) {
          window.localStorage.setItem("auth_token", token);
      } else {
          window.localStorage.removeItem("auth_token");
      }
  }
}


  request(method: string, url: string, data: any): Promise<any> {
      let headers: any = {};

      if (this.getAuthToken() !== null) {
          headers = {"Authorization": "Bearer " + this.getAuthToken()};
      }

      return axios({
          method: method,
          url: url,
          data: data,
          headers: headers
      });
  }



  
}