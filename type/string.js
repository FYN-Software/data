import Type from './type.js';

const min = Symbol('min');
const max = Symbol('max');

export default class extends Type
{
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

    static [Symbol.hasInstance](v)
    {
        return typeof v === 'string' || v.constructor === this;
    }
}