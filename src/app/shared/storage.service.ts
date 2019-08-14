import { Inject, Injectable } from '@angular/core';
import { STORAGE_MEDIUM } from 'src/app/shared/shared.tokens';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private static Prefix = 'eh';

  private readonly store = new Map<string, any>();

  constructor(@Inject(STORAGE_MEDIUM) private storage: Storage) {}

  get<T>(key: string): T | null {
    if (!this.store.has(key)) {
      const valueRaw = this.storage.getItem(this.buildStorageKey(key));
      const value = JSON.parse(valueRaw || 'null') || null;
      this.store.set(key, value);
      return value;
    } else {
      return this.store.get(key);
    }
  }

  set<T>(key: string, value: T): void {
    this.store.set(key, value);
    this.storage.setItem(this.buildStorageKey(key), JSON.stringify(value));
  }

  delete(key: string): void {
    this.store.delete(key);
    this.storage.removeItem(key);
  }

  private buildStorageKey(key: string): string {
    return `${StorageService.Prefix}:${key}`;
  }
}
