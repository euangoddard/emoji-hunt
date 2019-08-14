import { InjectionToken } from '@angular/core';
import { Announcer } from 'src/app/shared/announcer.base';

export const STORAGE_MEDIUM = new InjectionToken<Storage>('StorageMedium', {
  providedIn: 'root',
  factory: () => {
    return localStorage;
  },
});


export const ANNOUNCER = new InjectionToken<Announcer>('Announcer');
