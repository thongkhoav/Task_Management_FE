import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private fullName$ = new BehaviorSubject<string>('');
  private role$ = new BehaviorSubject<string>('');

  constructor() {}

  public setRoleForStore(role: string) {
    this.role$.next(role);
  }

  public getRoleFromStore() {
    return this.role$.asObservable();
  }

  public setFullNameForStore(fullName: string) {
    this.fullName$.next(fullName);
  }

  public getFullNameFromStore() {
    return this.fullName$.asObservable();
  }
}
