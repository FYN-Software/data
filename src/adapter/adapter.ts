type Converter<TIn, TOut> = (item: AsyncGenerator<TIn, void, void>) => AsyncGenerator<TOut, void, void>;
type AdapterConfig = {
    from: Converter<any, object>;
    to: Converter<any, any>;
};

export default class Adapter implements IAdapter
{
    private static readonly defaultConfig: AdapterConfig = {
        async *from(d: AsyncGenerator<any, void, void>): AsyncGenerator<object, void, void>
        {
            yield* d;
        },
        async *to(d: AsyncGenerator<any, void, void>): AsyncGenerator<any, void, void>
        {
            yield* d;
        },
    };

    private readonly _from: Converter<any, object>;
    private readonly _to: Converter<any, any>;
    private _source: ISource<any>|undefined;

    public get source(): ISource<any>|undefined
    {
        return this._source;
    }

    public set source(s: ISource<any>|undefined)
    {
        this._source = s;
    }

    constructor({ from, to }: AdapterConfig = Adapter.defaultConfig)
    {
        this._from = from;
        this._to = to;
    }

    public async *from(data: AsyncGenerator<any, void, void>): AsyncGenerator<object, void, void>
    {
        yield* this._from(data);
    }

    public async *to(data: AsyncGenerator<any, void, void>): AsyncGenerator<any, void, void>
    {
        yield* this._to(data);
    }

    public compile(query: any)
    {
        return query;
    }

    static get default(): typeof Adapter
    {
        return class extends this
        {
        }
    }
}