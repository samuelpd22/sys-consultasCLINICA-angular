import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  getItem(key: string): string | null {
    if (typeof window !== 'undefined') {
    console.log(window.localStorage.getItem('auth_token'));
      return window.localStorage.getItem(key);
    }
    return null;
  }

  setItem(key: string, value: string | null): void {
    if (typeof window !== 'undefined') {
      if (value !== null) {
        window.localStorage.setItem(key, value);
      } else {
        window.localStorage.removeItem(key);
      }
    }
  }
}