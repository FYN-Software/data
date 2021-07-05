import QueuedPromise from '@fyn-software/core/queuedPromise';
import Query from '../query/query';
declare type MapWithDefault<T> = {
    default: T;
    [key: string]: T;
};
export declare type StrategyMap<T extends IModel<T>> = MapWithDefault<IStrategy<T>>;
export declare type SourceMap<T extends IModel<T>> = MapWithDefault<ISource<T>>;
export declare type ModelConstructor<T extends IModel<T>> = Constructor<T> & {
    sources: SourceMap<T>;
    strategies?: StrategyMap<T>;
    properties: {
        [key: string]: any;
    };
};
export default abstract class Model<T extends IModel<T> & Model<T>> implements IModel<T> {
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
    toTransferable(): null;
    fetch(query: IQuery<T>, args: object): AsyncGenerator<object, void, void>;
    getSource(source: string): ISource<T> | undefined;
    to(source: string): Model<T>;
    save(this: T): Promise<boolean>;
    find(query: Query<T>, args?: object): QueuedPromise;
    findAll(query: Query<T>, args?: object): AsyncGenerator<T | object, void, void>;
    static from<T extends IModel<T>>(this: Constructor<T>, source: string): Query<T>;
    static where<T extends IModel<T>>(this: Constructor<T>, ...args: Array<any>): IQuery<T>;
    static select<T extends IModel<T>>(this: Constructor<T>, ...args: Array<any>): IQuery<T>;
    static order<T extends IModel<T>>(this: Constructor<T>, order: Order): IQuery<T>;
    static limit<T extends IModel<T>>(this: Constructor<T>, ...args: Array<any>): IQuery<T>;
    static find<T extends IModel<T>>(this: Constructor<T>, ...args: Array<any>): IQueuedPromise;
    static findAll<T extends IModel<T>>(this: Constructor<T>, ...args: Array<any>): AsyncGenerator<object | T, void, void>;
    static hasMany<T extends IModel<T>>(this: Constructor<T>, target: ModelConstructor<T>): typeof import("../relation/relation").default;
    static ownsMany<T extends IModel<T>>(this: Constructor<T>, target: ModelConstructor<T>): typeof import("../relation/relation").default;
    static hasOne<T extends IModel<T>>(this: Constructor<T>, target: ModelConstructor<T>): typeof import("../relation/relation").default;
    static ownsOne<T extends IModel<T>>(this: Constructor<T>, target: ModelConstructor<T>): typeof import("../relation/relation").default;
}
export {};
//# sourceMappingURL=model.d.ts.map