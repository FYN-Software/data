import Type from './type.js';

const properties = Symbol('properties');
const keys = Symbol('keys');
const values = Symbol('values');

export default class Enum extends Type
{
    constructor(value)
    {
        super({ value: value || null, template: null });
    }

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
        return (typeof v === 'symbol' && this[keys].has(v)) || v.constructor === this;
    }

    static define(template)
    {
        const self = this._configure('template', Object.seal({ ...template }));

        self[Symbol.iterator] = function*(){
            for(const [k, v] of Object.entries(self[properties]))
            {
                v.value = k;

                yield v;
            }
        };
        self.prototype[Symbol.iterator] = self[Symbol.iterator];
        self[properties] = template;
        self[keys] = new Map();
        self[values] = new Map();

        for(const k of Object.keys(template))
        {
            const s = Symbol(k);

            self[keys].set(s, k);
            self[values].set(k, s);

            Object.defineProperty(self, k, { value: s });
        }

        return self;

        // p = Object.seal(Object.assign({}, p));
        //
        // const symbols = new Map();
        // const names = new Map();
        // const c = class extends this
        // {
        //     [Symbol.toPrimitive](hint)
        //     {
        //         switch (hint)
        //         {
        //             case 'string':
        //                 return symbols.get(this.value);
        //
        //             default:
        //                 return this;
        //         }
        //     }
        //
        //     static get [properties]()
        //     {
        //         return p;
        //     }
        //
        //     static get [keys]()
        //     {
        //         return symbols;
        //     }
        //
        //     static get [values]()
        //     {
        //         return names;
        //     }
        //
        //     static *[Symbol.iterator]()
        //     {
        //         for(const [k, v] of Object.entries(p))
        //         {
        //             v.value = k;
        //
        //             yield v;
        //         }
        //     }
        // };
        //
        // for(const k of Object.keys(Object.values(p)[0]))
        // {
        //     Object.defineProperty(c.prototype, k, {
        //         get()
        //         {
        //             return this.constructor[properties][symbols.get(this.__value)][k];
        //         },
        //     });
        // }
        //
        // return c;
    }

    static valueOf(k)
    {
        return this[properties][this[keys].get(k)];
    }
}