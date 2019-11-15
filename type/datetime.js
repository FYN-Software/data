import Type from './type.js';

export default class extends Type
{
    constructor(value)
    {
        super({ value: Date.now() }, value);
    }

    get [Symbol.toStringTag]()
    {
        return `${super[Symbol.toStringTag]}.Datetime`;
    }
}