export abstract class AbstractStoreService<T, R> {
    constructor() { }
  
    public abstract select<K extends keyof T>(key: K): R;
  
    public abstract set<K extends keyof T>(key: K, data: T[K]): void;
  
    public abstract setState(partialState: Partial<T>): void;
  }