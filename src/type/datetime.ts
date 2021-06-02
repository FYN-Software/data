import Type from './type';

export default class extends Type
{
    public constructor(value: Date)
    {
        super({ value: Date.now() }, value);
    }

    public get [Symbol.toStringTag](): string
    {
        return `${super[Symbol.toStringTag]}.Datetime`;
    }
}