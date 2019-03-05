import { clone } from '../../core/extends.js';
import Type from './type.js';

const structure = Symbol('structure');

export default class extends Type
{
    constructor()
    {
        super();

        this.default(null);
    }

    static define(p)
    {
        p = Object.freeze(p);

        return class extends this
        {
            constructor()
            {
                super();

                for(const [ k, p ] of Object.entries(Object.assign({}, this.constructor[structure])))
                {
                    Object.defineProperty(this, k, {
                        get: () => p.__value,
                        set: v => p.__value = v,
                        enumerable: true,
                    });
                }

                this.__value = this;
            }

            static get [structure]()
            {
                return p;
            }
        };
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
}