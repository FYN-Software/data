import IType  from './iType';
import Type  from './type';

type FilterCallback<T> = (item: T, index?: number) => boolean;
type MapCallback<TIn, TOut> = (item: TIn, index?: number) => TOut;
type Callback = FilterCallback<any>|MapCallback<any, any>;

export default class List<T extends IType> extends Type
{
    private queue: Array<[ string, Callback ]> = [];

    public constructor(value: any)
    {
        super({ value: [], type: Type.Any }, value);
    }

    protected __set(v: any)
    {
        const o = v;
        const resolve = (v: Array<T>) => {
            if(this.$.type !== null && v.some(i => (i instanceof this.$.type) === false))
            {
                throw new Error(`Not all items are of type '${this.$.type.name}'`);
            }

            v = this.normalize(v);

            for(const type of v)
            {
                type.on({
                    changed: (d: any) => this.emit('changed', d),
                })
            }

            return new Proxy(v, {
                get: (target: Array<T>, property: string|symbol) => {
                    const index = Number.parseInt(property as string);

                    if (
                        typeof property === 'string'
                        && Number.isInteger(Number.parseInt(property))
                        && target[index] instanceof Type
                    )
                    {
                        return target[index]?.$.value;
                    }

                    switch (property)
                    {
                        case Symbol.iterator:
                            return this[Symbol.iterator].bind(this);

                        case Symbol.asyncIterator:
                            return this[Symbol.asyncIterator].bind(this);

                        case 'groupBy':
                            type GroupedResult = { [key: string]: Array<T> };

                            return (k: string): GroupedResult => this.$.value.reduce(
                                (t: GroupedResult, i: T): GroupedResult => {
                                    const key: string = String(i[k as keyof T]);

                                    (t[key] = t[key] ?? []).push(i);

                                    return t;
                                },
                                {}
                            );

                        case 'push':
                        case 'unshift':
                            return this.typeCheck(target, property);

                        case 'first':
                        case 'last':
                            return target[property]!.$.value;

                        default:
                            return target[property as keyof Array<T>];
                    }
                },
            });
        };

        if(Array.isArray(v) === false)
        {
            if(typeof v === 'string')
            {
                v = JSON.tryParse(v.replace(/(?<!\\)'/g, '"').replace(/\\'/g, "'"));
            }
            else if(typeof v[Symbol.iterator] === 'function')
            {
                v = Array.from(v);
            }
            else if(typeof v[Symbol.asyncIterator] === 'function')
            {
                if(v.hasOwnProperty('__marker__') === true)
                {
                    return v;
                }

                const self = this;

                //TODO(Chris Kruining) This should probably be it's own class (in it's own file)
                return new class Iterable
                {
                    public __marker__: undefined;
                    public value: Array<T>|undefined;

                    async find(precondition: (item: T) => boolean)
                    {
                        for await (const item of this)
                        {
                            if((await precondition(item)) === true)
                            {
                                return item;
                            }
                        }
                    }

                    async join(separator: string)
                    {
                        const items = [];
                        for await (const item of this)
                        {
                            items.push(item);
                        }

                        return items.join(separator);
                    }

                    async *map<TOut>(callback: MapCallback<T, TOut>)
                    {
                        let i = 0;
                        for await (const item of this)
                        {
                            yield await callback(item, i);

                            i++;
                        }

                        return this;
                    }

                    async *filter(callback: FilterCallback<T>)
                    {
                        let i = 0;
                        for await (const item of this)
                        {
                            if((await callback(item, i)) === true)
                            {
                                yield item;
                            }

                            i++;
                        }

                        return this;
                    }

                    async *[Symbol.asyncIterator]()
                    {
                        const value = [];

                        for await (let item of this.value ?? v)
                        {
                            if(this.value === undefined)
                            {
                                item = item[Symbol.toStringTag]?.startsWith('Type') ? item : new self.$.type(item);
                                item.on({ changed: (d: any) => self.emit('changed', d) })
                                value.push(item);
                            }

                            yield item;
                        }

                        if(this.value === undefined)
                        {
                            this.value = value;
                        }
                    }
                }
            }
            else if(v instanceof Promise)
            {
                return v.then(resolve);
            }
            else
            {
                throw new Error(`Expected an 'Array', got '${v.constructor.name}'`);
            }
        }

        return resolve(v);
    }

    public [Symbol.toPrimitive](hint: string): any
    {
        switch (hint)
        {
            case 'transferable':
            case 'clone':
            {
                return Array.from(this.$.value, (i: T) => i[Symbol.toPrimitive](hint));
            }

            default:
                return this.$.value;
        }
    }

    public get [Symbol.toStringTag](): string
    {
        return `${super[Symbol.toStringTag]}.List`;
    }

    public filter(callback: FilterCallback<T>): List<T>
    {
        this.queue.push([ 'filter', callback ]);

        return this;
    }

    public map<TOut>(callback: MapCallback<T, TOut>): List<T>
    {
        this.queue.push([ 'map', callback ]);

        return this;
    }

    private typeCheck(target: Array<T>, method: keyof Array<T>): any
    {
        return (...items: Array<T>): any => {
            if(items.some(i => (i instanceof this.$.type) === false))
            {
                throw new Error(`Not all items are of type '${this.$.type.name}'`);
            }

            return (target[method]! as Function).apply(target, this.normalize(items));
        }
    }

    private normalize(items: Array<T>)
    {
        return items.map((i: T) => i?.[Symbol.toStringTag]?.startsWith('Type') ? i : new this.$.type(i));
    }

    public static [Symbol.hasInstance](v: Array<any>|List<any>): boolean
    {
        return Array.isArray(v) || v.constructor === this;
    }

    public *[Symbol.iterator](): Iterable<T>
    {
        yield* this.$.value as Array<T>;
    }

    public async *[Symbol.asyncIterator](): AsyncIterable<any>
    {
        outer:
        for(let item of this.$.value as Array<T>)
        {
            if(item.constructor.name === 'Any')
            {
                item = item.$.value;
            }

            for(const [method, callback] of this.queue)
            {
                switch (method)
                {
                    case 'filter':
                        if(Boolean(await (callback as FilterCallback<T>)(item)) === false)
                        {
                            continue outer;
                        }

                        break;

                    case 'map':
                        item = await (callback as MapCallback<T, any>)(item);

                        break;
                }
            }

            yield item;
        }

        this.queue = [];
    }

    public static type<T extends IType>(t: Constructor<T>): typeof Type
    {
        return this._configure('type', t);
    }
}