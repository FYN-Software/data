import Type from './type.js';

export default class extends Type
{
    constructor(value)
    {
        super({ value: false }, value);
    }

    __set(v)
    {
        return Boolean(v);
    }

    static [Symbol.hasInstance](v)
    {
        return typeof v === 'boolean' || v.constructor === this;
    }
}