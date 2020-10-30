import Type from './type.js';

export default class extends Type
{
    constructor(value)
    {
        super({ value: 0, min: -Infinity, max: Infinity }, value);
    }

    __set(v)
    {
        if(Number.isNaN(v) === true)
        {
            throw new Error(`Given value '${v}' is NaN`);
        }

        return Math.clamp(this.$.min, this.$.max, v);
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
        return typeof v === 'number' || v.constructor === this;
    }
}