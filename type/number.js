import Type from './type.js';

const min = Symbol('min');
const max = Symbol('max');

export default class extends Type
{
    constructor()
    {
        super();

        this[min] = -Infinity;
        this[max] = Infinity;
        this.default(0);
    }

    __set(v)
    {
        if(Number.isNaN(v) === true)
        {
            throw new Error(`Given value is NaN`);
        }

        return Math.clamp(this[min], this[max], v);
    }

    min(i)
    {
        if(Number.isInteger(i) === false)
        {
            throw new Error(`Expected an integer, got '${i}'`);
        }

        this[min] = i;

        return this;
    }

    max(i)
    {
        if(Number.isInteger(i) === false)
        {
            throw new Error(`Expected an integer, got '${i}'`);
        }

        this[max] = i;

        return this;
    }

    static min(i)
    {
        return (new this).min(i);
    }

    static max(i)
    {
        return (new this).max(i);
    }

    static [Symbol.hasInstance](v)
    {
        return typeof v === 'number' || v.constructor === this;
    }
}