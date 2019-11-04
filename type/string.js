import Type from './type.js';

export default class extends Type
{
    constructor(value)
    {
        super({ value: value || '', min: 0, max: Infinity });
    }

    get [Symbol.toStringTag]()
    {
        return `${super[Symbol.toStringTag]}.String`;
    }

    __set(v)
    {
        return String(v).padEnd(this.min, ' ').substr(0, this.max);
    }

    static min(i)
    {
        if(Number.isInteger(i) === false)
        {
            throw new Error(`Expected an integer, got '${i}'`);
        }

        return this._configure('min', i);
    }

    static max(i)
    {
        if(Number.isInteger(i) === false)
        {
            throw new Error(`Expected an integer, got '${i}'`);
        }

        return this._configure('max', i);
    }

    static [Symbol.hasInstance](v)
    {
        return typeof v === 'string' || v.constructor === this;
    }
}