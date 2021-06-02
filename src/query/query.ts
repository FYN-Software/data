import QueuedPromise from '@fyn-software/core/queuedPromise';
import IQuery, { Order, Method } from './iQuery';
import IModel from '../model/iModel.js';

export { Order };

export default class Query<T extends IModel<T>> implements IQuery<T>
{
    private readonly _target: T;
    private readonly _methods: Array<Method> = [];

    public constructor(target: T)
    {
        this._target = target;
    }

    public *[Symbol.iterator](): Iterable<Method>
    {
        yield* this._methods;
    }

    public get target(): T
    {
        return this._target;
    }
    public get methods(): Array<Method>
    {
        return this._methods;
    }

    public find(args: object = {}): QueuedPromise
    {
        return this.limit(1).target.find(this, args);
    }
    public async *findAll(args: object = {}): AsyncGenerator<T|object, void, void>
    {
        yield* this.target.findAll(this, args);
    }

    public insert(...args: Array<any>): IQuery<T>
    {
        this._methods.push([ 'insert', args ]);

        return this;
    }
    public update(...args: Array<any>): IQuery<T>
    {
        this._methods.push([ 'update', args ]);

        return this;
    }
    public where(...args: Array<any>): IQuery<T>
    {
        this._methods.push([ 'where', args ]);

        return this;
    }
    public select(...args: Array<any>): IQuery<T>
    {
        this._methods.push([ 'select', args ]);

        return this;
    }
    public order(order: Order): IQuery<T>
    {
        this._methods.push([ 'order', [ order ] ]);

        return this;
    }
    public limit(...args: Array<any>): IQuery<T>
    {
        this._methods.push([ 'limit', args ]);

        return this;
    }

    public static where<T extends IModel<T>>(model: T, ...args: Array<any>): IQuery<T>
    {
        return new this(model).where(...args);
    }
    public static select<T extends IModel<T>>(model: T, ...args: Array<any>): IQuery<T>
    {
        return new this(model).select(...args);
    }
    public static order<T extends IModel<T>>(model: T, order: Order): IQuery<T>
    {
        return new this(model).order(order);
    }
    public static limit<T extends IModel<T>>(model: T, ...args: Array<any>): IQuery<T>
    {
        return new this(model).limit(...args);
    }
}