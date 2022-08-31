import { Observable } from 'rxjs';
import BaseChannel from './channel';
import type { Bus, Client } from './tangle';
export default class WebWorkerChannel<T> extends BaseChannel<Worker, T> {
    register(providers: Worker[]): Observable<Bus<T>>;
    register(providers: Observable<Worker>[]): Observable<Bus<T>>;
    attach(): Client<T>;
}
//# sourceMappingURL=webworkers.d.ts.map