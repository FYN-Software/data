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
                throw new Error(`Properties are expected to be typed, got '${v}'`);
            }

            this.#fields[k] = v;

            Object.defineProperty(this, k, {
                get: () => this.#fields[k].value,
                set: this.#fields[k].setValue.bind(this.#fields[k]),
            })
        }
    }

    __set(v)
    {
        if(v === null || v === undefined)
        {
            return v;
        }

        if(typeof v !== 'object')
        {
            console.trace(v, this.template);

            v = {};
        }

        return v;

        return new Proxy(v, {
            get: (target, property) => {
                // console.log(property);

                if(typeof target[property] === 'function')
                {
                    return target[property].bind(target);
                }

                return target[property];
            },
            set: (target, property, value, receiver) => {
                // console.log(arguments);

                target[property] = value;

                return true;
            }
        });
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