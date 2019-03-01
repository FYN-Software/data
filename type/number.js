import Type from './type.js';

const min = Symbol('min');
const max = Symbol('max');

export default class extends Type
{
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
        return typeof v === 'number' || v.constructor === this;
    }
}