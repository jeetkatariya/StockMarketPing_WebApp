import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatesaveService {
  private states = new Map<string, BehaviorSubject<any>>();

  constructor(private http: HttpClient) {}

  private ensureStateInitialized(key: string): BehaviorSubject<any> {
    if (!this.states.has(key)) {
      this.states.set(key, new BehaviorSubject<any>(null));
    }
    return this.states.get(key)!;
  }

  setState(key: string, data: any): void {
    let state = this.states.get(key);
    if (!state) {
      state = this.ensureStateInitialized(key);
    }
    state.next(data);
  }

  getState(key: string): Observable<any> {
    return this.ensureStateInitialized(key).asObservable();
  }

  fetchData(key: string, url: string): Observable<any> {
    const existingData = this.states.get(key)?.getValue();
    if (existingData) {
      return this.getState(key);
    } else {
   
      return this.http.get(url).pipe(
        tap(data => {
          this.setState(key, data); 
        })
      );
    }
  }
}
