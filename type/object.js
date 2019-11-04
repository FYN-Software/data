import Type from './type.js';

const structure = Symbol('structure');

export default class extends Type
{
    constructor()
    {
        super({ value: {}, template: {} });
    }

    __set(v)
    {
        console.log(this.template);

        return new Proxy(v, {
            get: (target, property) => {
                // console.log(property);

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