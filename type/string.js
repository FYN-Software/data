import Type from './type.js';

export default class extends Type
{
    #min = -Infinity;
    #max = Infinity;

    constructor()
    {
        super();

        this.default('');
    }

    __set(v)
    {
        return String(v);
    }

    min(i)
    {
        if(Number.isInteger(i) === false || i < 0)
        {
            throw new Error(`Expected an unsigned integer, got '${i}'`);
        }

        this.#min = i;

        return this;
    }

    max(i)
    {
        if(Number.isInteger(i) === false || i < 0)
        {
            throw new Error(`Expected an unsigned integer, got '${i}'`);
        }

        this.#max = i;

        return this;
    }

    static min(i)
    {
        return new this.min(i);
    }

    static max(i)
    {
        return new this.max(i);
    }

    static [Symbol.hasInstance](v)
    {
        return typeof v === 'string' || v.constructor === this;
    }
}