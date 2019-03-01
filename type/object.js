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

                for(const [ k, v ] of Object.entries(clone(this.constructor[structure])))
                {
                    Object.defineProperty(this, k, { value: v });
                }
            }

            static get [structure]()
            {
                return p;
            }
        };
    }
}