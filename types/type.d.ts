declare type Method = [ string, Array<any> ];

declare enum Order
{
    asc,
    desc,
}

declare interface IRelation
{

}

declare interface IQuery<T extends IModel<T>>
{
    readonly target: T
    readonly methods: Array<Method>

    find(args?: object): IQueuedPromise;
    findAll(args?: object): AsyncIterable<T|object>

    [Symbol.iterator](): Iterable<Method>;

    insert(...args: Array<any>): IQuery<T>;
    update(...args: Array<any>): IQuery<T>;
    where(...args: Array<any>): IQuery<T>;
    select(...args: Array<any>): IQuery<T>;
    order(order: Order): IQuery<T>;
    limit(...args: Array<any>): IQuery<T>;
}

declare interface IModel<T extends IModel<T>>
{
    source: any;
    new: boolean;
    raw: boolean;

    fetch(query: IQuery<T>, args: object): AsyncGenerator<object, void, void>;

    find(query: IQuery<T>, args?: object): IQueuedPromise;
    findAll(query: IQuery<T>, args?: object): AsyncGenerator<T|object, void, void>;
}

declare interface ISource<T extends IModel<T>>
{
    owner: IModel<T>|undefined;
    readonly connection: IConnection;
    readonly adapter: IAdapter;
    readonly schema: ISchema;

    fetch(query: IQuery<T>, args: object): AsyncGenerator<object, void, void>;
}

declare interface IStrategy<T extends IModel<T>>
{
    owner: IModel<T>|undefined;

    fetch(query: IQuery<T>, args: object): AsyncGenerator<object, void, void>;
}

declare interface IConnection
{
    source: ISource<any>|undefined;
    fetch(query: any, args?: object): AsyncGenerator<any, void, void>;
}

declare interface ISchema
{
    source: ISource<any>|undefined;
    prepare<T extends IModel<T>>(query: IQuery<T>, args?: object): Promise<any>;
    map(data: AsyncGenerator<object, void, void>): AsyncGenerator<object, void, void>;
}

declare interface IAdapter
{
    source: ISource<any>|undefined;

    from(data: AsyncGenerator<any, void, void>): AsyncGenerator<object, void, void>;
    to(data: AsyncGenerator<any, void, void>): AsyncGenerator<any, void, void>;

    compile(query: any): any;
}