declare type Method = [ string, Array<any> ];

declare enum Order
{
    asc,
    desc,
}

declare interface IQueuedPromise
{

}

declare interface TypeConfig
{
    getter?: (value: any) => any;
    setter?: (value: any) => any;
    value?: any;
    [key: string]: any
}

declare interface IType extends EventTarget
{
    readonly $: TypeConfig;
    readonly [Symbol.toStringTag]: string;

    [Symbol.toPrimitive](hint: string): any;
    setValue<T>(v: T): Promise<T>;
}

declare interface TypeConstructor extends Constructor<IType>
{
    new (): IType;
    config: TypeConfig;
}

declare interface IQuery<T extends IModel<T>> extends IType
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

declare interface IModel<T extends IModel<T>> extends IType
{
    source: any;
    new: boolean;
    raw: boolean;
    readonly $: { [key: string]: any };

    fetch(query: IQuery<T>, args: object): AsyncGenerator<object, void, void>;

    find(query: IQuery<T>, args?: object): IQueuedPromise;
    findAll(query: IQuery<T>, args?: object): AsyncGenerator<T|object, void, void>;
}

declare interface IStrategy<T extends IModel<T>>
{
    owner: IModel<T>|undefined;

    fetch(query: IQuery<T>, args: object): AsyncGenerator<object, void, void>;
}