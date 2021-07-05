import QueuedPromise from '@fyn-software/core/queuedPromise';
import Field from './field';
import Query  from '../query/query';
import HasMany from '../relation/hasMany';
import HasOne from '../relation/hasOne';
import OwnsMany from '../relation/ownsMany';
import OwnsOne from '../relation/ownsOne';


type MapWithDefault<T> = {
    default: T;
    [key: string]: T;
};
export type StrategyMap<T extends IModel<T>> = MapWithDefault<IStrategy<T>>;
export type SourceMap<T extends IModel<T>> = MapWithDefault<ISource<T>>;

export type ModelConstructor<T extends IModel<T>> = Constructor<T> & {
    sources: SourceMap<T>;
    strategies?: StrategyMap<T>;
    properties: { [key: string]: any },
};

export default abstract class Model<T extends IModel<T> & Model<T>> implements IModel<T>
{
    static get properties()
    {
        return {};
    }
    static get sources()
    {
        throw new Error(`Not implemented`);
    }

    private _strategies: Map<string, IStrategy<T>> = new Map();
    private _strategy: string = 'default';
    private _sources: Map<string, ISource<T>> = new Map();
    private _source: string = 'default';
    private _raw: boolean = false;
    private _new: boolean = true;

    get strategy(): string
    {
        return this._source;
    }
    set strategy(strategy: string)
    {
        this._strategy = strategy;
    }

    get source(): string
    {
        return this._source;
    }
    set source(source: string)
    {
        this._source = source;
    }

    get new(): boolean
    {
        return this._new;
    }
    set new(value: boolean)
    {
        this._new = value;
    }

    get raw()
    {
        return this._raw;
    }
    set raw(value: boolean)
    {
        this._raw = value;
    }

    protected constructor(value: any)
    {
        const constructor = this.constructor as ModelConstructor<any>;

        if(constructor.strategies !== undefined)
        {
            this._strategies = new Map(Object.entries(constructor.strategies));

            for(const strategy of this._strategies.values())
            {
                strategy.owner = this;
            }
        }

        this._sources = new Map(Object.entries(constructor.sources));

        for(const source of this._sources.values())
        {
            source.owner = this;
        }
    }

    public toTransferable()
    {
        return null;//this[Symbol.toPrimitive]('transferable');
    }

    public async *fetch(query: IQuery<T>, args: object): AsyncGenerator<object, void, void>
    {
        const source: IStrategy<T>|ISource<T> = this._strategies.get(this._strategy)
            ?? this._sources.get(this._source)
            ?? this._sources.get('default')!;

        yield* source.fetch(query, args);
    }

    public getSource(source: string): ISource<T>|undefined
    {
        return this._sources.get(source);
    }

    public to(source: string): Model<T>
    {
        this._source = source;

        return this;
    }

    public async save(this: T): Promise<boolean>
    {
        try
        {
            await Array.fromAsync(this.fetch(new Query(this)[this.new ? 'insert' : 'update'](this), {}));

            return true;
        }
        catch(e)
        {
            console.error(e)

            return false;
        }
    }

    public find(query: Query<T>, args: object = {}): QueuedPromise
    {
        return new QueuedPromise((async () => {
            for await(const v of this.fetch(query, args))
            {
                if(this._raw === true)
                {
                    return v;
                }

                const model = this.constructor as ModelConstructor<T>;

                return v === undefined
                    ? null
                    : (() => {
                        const inst = new model(v);
                        inst.new = false;
                        return inst })();
            }
        })());
    }
    public async *findAll(query: Query<T>, args: object = {}): AsyncGenerator<T|object, void, void>
    {
        if(this._raw === true)
        {
            yield* this.fetch(query, args);

            return;
        }

        const model = this.constructor as ModelConstructor<T>;
        for await (const r of this.fetch(query, args))
        {
            const inst = new model(r);
            inst.new = false;

            yield inst;
        }
    }

    public static from<T extends IModel<T>>(this: Constructor<T>, source: string)
    {
        const inst = new this;
        inst.source = source;

        return new Query(inst);
    }
    public static where<T extends IModel<T>>(this: Constructor<T>, ...args: Array<any>)
    {
        return new Query(new this).where(...args);
    }
    public static select<T extends IModel<T>>(this: Constructor<T>, ...args: Array<any>)
    {
        return new Query(new this).select(...args);
    }
    public static order<T extends IModel<T>>(this: Constructor<T>, order: Order)
    {
        return new Query(new this).order(order);
    }
    public static limit<T extends IModel<T>>(this: Constructor<T>, ...args: Array<any>)
    {
        return new Query(new this).limit(...args);
    }
    public static find<T extends IModel<T>>(this: Constructor<T>, ...args: Array<any>)
    {
        return new Query(new this).find(...args);
    }
    public static async *findAll<T extends IModel<T>>(this: Constructor<T>, ...args: Array<any>)
    {
        yield* (new Query(new this).findAll(...args));
    }

    public static hasMany<T extends IModel<T>>(this: Constructor<T>, target: ModelConstructor<T>)
    {
        return HasMany.ownedBy(this).targets(target);
    }
    public static ownsMany<T extends IModel<T>>(this: Constructor<T>, target: ModelConstructor<T>)
    {
        return OwnsMany.ownedBy(this).targets(target);
    }
    public static hasOne<T extends IModel<T>>(this: Constructor<T>, target: ModelConstructor<T>)
    {
        return HasOne.ownedBy(this).targets(target);
    }
    public static ownsOne<T extends IModel<T>>(this: Constructor<T>, target: ModelConstructor<T>)
    {
        return OwnsOne.ownedBy(this).targets(target);
    }
}