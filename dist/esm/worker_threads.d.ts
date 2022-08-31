/// <reference types="node" />
import { Observable } from 'rxjs';
import type { Worker } from 'worker_threads';
import BaseChannel from './channel';
import type { Bus, Client } from './tangle';
export default class WorkerThreadChannel<T> extends BaseChannel<Worker, T> {
    register(providers: Worker[]): Observable<Bus<T>>;
    register(providers: Observable<Worker>[]): Observable<Bus<T>>;
    attach(): Client<T>;
}
//# sourceMappingURL=worker_threads.d.ts.map