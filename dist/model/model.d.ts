import QueuedPromise from '@fyn-software/core/queuedPromise';
import Query, { Order } from '../query/query';
import ObjectType, { ObjectTemplate } from '../type/object';
import IModel from './iModel.js';
import ISource from '../source/iSource';
import IStrategy from '../strategy/iStrategy';
import IQuery from '../query/iQuery';
declare type MapWithDefault<T> = {
    default: T;
    [key: string]: T;
};
export declare type StrategyMap<T extends IModel<T>> = MapWithDefault<IStrategy<T>>;
export declare type SourceMap<T extends IModel<T>> = MapWithDefault<ISource<T>>;
export declare type ModelConstructor<T extends IModel<T>> = Constructor<T> & {
    sources: SourceMap<T>;
    strategies?: StrategyMap<T>;
    properties: ObjectTemplate;
};
export default abstract class Model<T extends IModel<T> & Model<T>> extends ObjectType implements IModel<T> {
    static get properties(): {};
    static get sources(): void;
    private _strategies;
    private _strategy;
    private _sources;
    private _source;
    private _raw;
    private _new;
    get strategy(): string;
    set strategy(strategy: string);
    get source(): string;
    set source(source: string);
    get new(): boolean;
    set new(value: boolean);
    get raw(): boolean;
    set raw(value: boolean);
    protected constructor(value: any);
    toTransferable(): object;
    fetch(query: IQuery<T>, args: object): AsyncGenerator<object, void, void>;
    getSource(source: string): ISource<T> | undefined;
    to(source: string): Model<T>;
    save(this: T): Promise<boolean>;
    find(query: Query<T>, args?: object): QueuedPromise;
    findAll(query: Query<T>, args?: object): AsyncGenerator<T | object, void, void>;
    static from<T extends IModel<T>>(this: Constructor<T>, source: string): Query<T>;
    static where<T extends IModel<T>>(this: Constructor<T>, ...args: Array<any>): any;
    static select<T extends IModel<T>>(this: Constructor<T>, ...args: Array<any>): any;
    static order<T extends IModel<T>>(this: Constructor<T>, order: Order): any;
    static limit<T extends IModel<T>>(this: Constructor<T>, ...args: Array<any>): any;
    static find<T extends IModel<T>>(this: Constructor<T>, ...args: Array<any>): QueuedPromise;
    static findAll<T extends IModel<T>>(this: Constructor<T>, ...args: Array<any>): AsyncGenerator<object | T, void, void>;
    static hasMany<T extends IModel<T>>(this: Constructor<T>, target: ModelConstructor<T>): typeof import("../relation/relation").default;
    static ownsMany<T extends IModel<T>>(this: Constructor<T>, target: ModelConstructor<T>): typeof import("../relation/relation").default;
    static hasOne<T extends IModel<T>>(this: Constructor<T>, target: ModelConstructor<T>): typeof import("../relation/relation").default;
    static ownsOne<T extends IModel<T>>(this: Constructor<T>, target: ModelConstructor<T>): typeof import("../relation/relation").default;
    static withSources<T extends IModel<T>>(sources: SourceMap<T>): typeof Model;
    static initialize<T extends Model<T>>(model: ModelConstructor<T>): TypeConstructor;
}
export {};
//# sourceMappingURL=model.d.ts.map