import Type from './type.js';

const structure = Symbol('structure');

export default class extends Type
{
    #fields = {};

    constructor(conf = {})
    {
        super({ ...{ value: {}, template: {} }, ...conf });

        for(let [k, v] of Object.entries(this.template))
        {
            if((v instanceof Type) === false && v.prototype instanceof Type)
            {
                v = new v;
            }

            if((v instanceof Type) === false)
            {
                throw new Error(`Properties are expected to be typed, got '${v}' instead`);
            }

            this.#fields[k] = v;

            if(this.hasOwnProperty(k) === false)
            {
                Object.defineProperty(this, k, {
                    get: () => this.#fields[k].value,
                    set: this.#fields[k].setValue.bind(this.#fields[k]),
                });
            }
        }
    }

    __set(value)
    {
        if(value === null || value === undefined)
        {
            return value;
        }

        if(typeof value !== 'object')
        {
            value = {};
        }

        const returnValue = value;

        for(const [ k, v ] of Object.entries(this.template))
        {
            const property = new v(value[k] || undefined);

            if((property instanceof v) === false)
            {
                throw new Error(`Type mismatch, expected instance of '${v.name}', got '${value[k]}' instead`);
            }

            if(returnValue.hasOwnProperty(k) === false)
            {
                Object.defineProperty(returnValue, k, {
                    get: () => property.value,
                    set: v => property.setValue(v),
                    configurable: false,
                    enumerable: true,
                });
            }
        }

        return returnValue;
    }

    static define(template)
    {
        for(const [ key, item ] of Object.entries(template))
        {
            if((item.prototype instanceof Type) === false && typeof item === 'object')
            {
                template[key] = this.define(item);
            }
        }

        return this._configure('template', template);
    }

    static [Symbol.hasInstance](v)
    {
        if(this.hasOwnProperty(structure) === false)
        {
            return typeof v === 'object';
        }

        console.log(this, this.hasOwnProperty(structure), v);

        return true;
    }

    static fromClass(c)
    {
        console.dir(c);

        return class extends c
        {
            static get [Symbol.species]()
            {
                return Type;
            }

            get __value()
            {
                return this;
            }
        };
    }
}