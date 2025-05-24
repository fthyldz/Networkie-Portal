import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private messageSubject = new BehaviorSubject<string>('');

  loading$ = this.loadingSubject.asObservable();
  message$ = this.messageSubject.asObservable();

  show(message: string = '', seconds: number = 0) {
    this.messageSubject.next(message);
    this.loadingSubject.next(true);
    if (seconds !== 0) {
      setTimeout(() => {
        this.hide();
      }, seconds * 1000);
    }
  }

  hide() {
    this.loadingSubject.next(false);
    this.messageSubject.next('');
  }
} 