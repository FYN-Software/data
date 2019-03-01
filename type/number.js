import Type from './type.js';

const min = Symbol('min');
const max = Symbol('max');

export default class extends Type
{
    constructor()
    {
        super();

        this.default(0);
        this[min] = -Infinity;
        this[max] = Infinity;
    }

    __set(v)
    {
        return Math.clamp(this[min], this[max], v);
    }

    min(i)
    {
        if(Number.isInteger(i) === false || i < 0)
        {
            throw new Error(`Expected an unsigned integer, got '${i}'`);
        }

        this[min] = i;

        return this;
    }

    max(i)
    {
        if(Number.isInteger(i) === false || i < 0)
        {
            throw new Error(`Expected an unsigned integer, got '${i}'`);
        }

        this[max] = i;

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
        return typeof v === 'number' || v.constructor === this;
    }
}