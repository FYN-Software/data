import Type from './type';

const properties = Symbol('properties');
const indices = Symbol('indices');
const keys = Symbol('keys');
const values = Symbol('values');

type EnumTemplate = {
    [key: string]: object;
};

type EnumConstructor = {
    new (): Enum;

    nameOf(k: symbol): string|undefined;
    indexOf(k: symbol): number|undefined;
    valueOf(k: symbol): any;

    [Symbol.iterator]: Iterable<any>;
    [properties]: EnumTemplate;
    [values]: Map<string, symbol>;
    [keys]: Map<symbol, string>;
    [indices]: Map<symbol, number>;
};

export default class Enum extends Type
{
    public constructor(value: string|symbol|undefined)
    {
        super({ value: null, template: null, enum: true }, value);
    }

    protected __set<T extends Enum>(v: T|string|symbol|undefined): symbol|undefined
    {
        if(v === undefined)
        {
            return v;
        }

        const c = (this.constructor as EnumConstructor);

        if(typeof v === 'string' && c[values].has(v))
        {
            return c[values].get(v);
        }

        if((v instanceof this.constructor) === false)
        {
            const k = Array.from(c[keys].values(), k => `${k}`);

            throw new Error(`'${v.toString()}' is not a value of this Enum, expected one of [${k}]`);
        }

        return v as symbol;
    }

    public [Symbol.toPrimitive](hint: string): string|undefined
    {
        return (this.constructor as EnumConstructor).nameOf(this.$.value);
    }

    public get [Symbol.toStringTag](): string
    {
        return `${super[Symbol.toStringTag]}.Enum`;
    }

    public static [Symbol.hasInstance]<T extends Enum>(this: EnumConstructor, v: T|string|symbol): boolean
    {
        return (typeof v === 'symbol' && this[keys].has(v)) || (v !== null && v !== undefined && v.constructor === this);
    }

    public static define(template: EnumTemplate): EnumConstructor
    {
        const self: any = this._configure('template', Object.seal({ ...template }));

        self[Symbol.iterator] = function*(): Iterable<any>
        {
            //NOTE(Chris Kruining)
            // Use destructor + rest to copy
            // items instead of reference
            for(const [k, { ...v } ] of Object.entries(self[properties]) as Array<[ string, EnumTemplate ]>)
            {
                v.value = self[values].get(k);
                v._key = k as any;

                yield v;
            }
        };
        self.prototype[Symbol.iterator] = self[Symbol.iterator];
        self[properties] = template;
        self[indices] = new Map();
        self[keys] = new Map();
        self[values] = new Map();

        for(const [ i, k ] of Object.entries(Object.keys(template)))
        {
            const s = Symbol(k);

            self[indices].set(s, Number.parseInt(i));
            self[keys].set(s, k);
            self[values].set(k, s);

            Object.defineProperty(self, k, { value: s });
        }

        return self;
    }

    public static nameOf(this: EnumConstructor, k: symbol): string|undefined
    {
        return this[keys].get(k);
    }

    public static indexOf(this: EnumConstructor, k: symbol): number|undefined
    {
        return this[indices].get(k);
    }

    public static valueOf(this: EnumConstructor, k: symbol): any
    {
        return this[properties][this.nameOf(k) as keyof object];
    }
}