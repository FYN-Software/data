import QueuedPromise from '@fyn-software/core/queuedPromise';
import IQuery, { Order, Method } from './iQuery';
import IModel from '../model/iModel.js';
export { Order };
export default class Query<T extends IModel<T>> implements IQuery<T> {
    private readonly _target;
    private readonly _methods;
    constructor(target: T);
    [Symbol.iterator](): Iterable<Method>;
    get target(): T;
    get methods(): Array<Method>;
    find(args?: object): QueuedPromise;
    findAll(args?: object): AsyncGenerator<T | object, void, void>;
    insert(...args: Array<any>): IQuery<T>;
    update(...args: Array<any>): IQuery<T>;
    where(...args: Array<any>): IQuery<T>;
    select(...args: Array<any>): IQuery<T>;
    order(order: Order): IQuery<T>;
    limit(...args: Array<any>): IQuery<T>;
    static where<T extends IModel<T>>(model: T, ...args: Array<any>): IQuery<T>;
    static select<T extends IModel<T>>(model: T, ...args: Array<any>): IQuery<T>;
    static order<T extends IModel<T>>(model: T, order: Order): IQuery<T>;
    static limit<T extends IModel<T>>(model: T, ...args: Array<any>): IQuery<T>;
}
//# sourceMappingURL=query.d.ts.map