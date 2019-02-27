import Type from './type.js';
import { clone } from '../../core/extends.js';

const properties = Symbol('properties');
const keys = Symbol('keys');

export default class Enum extends Type
{
    set(v)
    {
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
        p = Object.freeze(clone(p));

        const symbols = new Map();
        const c = class extends this
        {
            static get [properties]()
            {
                return p;
            }

            static get [keys]()
            {
                return symbols;
            }
        };

        for(const k of Object.keys(p))
        {
            const s = Symbol(k);

            symbols.set(s, k);

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