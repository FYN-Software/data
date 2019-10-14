import Type from './type.js';

const properties = Symbol('properties');
const keys = Symbol('keys');
const values = Symbol('values');

export default class Enum extends Type
{
    __set(v)
    {
        if(typeof v === 'string' && this.constructor[values].has(v))
        {
            v = this.constructor[values].get(v);
        }

        if((v instanceof this.constructor) === false)
        {
            const k = Array.from(this.constructor[keys].values(), k => `'${k}'`);

            throw new Error(`'${v}' is not a value of this Enum, expected one of [${k}]`);
        }

        return v;
    }

    static [Symbol.hasInstance](v)
    {
        return typeof v === 'symbol' && this[keys].has(v);
    }

    static define(p)
    {
        p = Object.seal(Object.assign({}, p));

        const symbols = new Map();
        const names = new Map();
        const c = class extends this
        {
            [Symbol.toPrimitive](hint)
            {
                switch (hint)
                {
                    case 'string':
                        return symbols.get(this.__value);

                    default:
                        return this;
                }
            }

            static get [properties]()
            {
                return p;
            }

            static get [keys]()
            {
                return symbols;
            }

            static get [values]()
            {
                return names;
            }

            static *[Symbol.iterator]()
            {
                for(const [k, v] of Object.entries(p))
                {
                    v.value = k;

                    yield v;
                }
            }
        };

        for(const k of Object.keys(p))
        {
            const s = Symbol(k);

            symbols.set(s, k);
            names.set(k, s);

            Object.defineProperty(c, k, { value: s });
        }

        for(const k of Object.keys(Object.values(p)[0]))
        {
            Object.defineProperty(c.prototype, k, {
                get()
                {
                    return this.constructor[properties][symbols.get(this.__value)][k];
                },
            });
        }

        return c;
    }

    static valueOf(k)
    {
        return this[properties][this[keys].get(k)];
    }
}