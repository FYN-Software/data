import Type from './type';

export default class Str extends Type
{
    public constructor(value:any)
    {
        super({ value: '', min: 0, max: Infinity }, value);
    }

    public get [Symbol.toStringTag](): string
    {
        return `${super[Symbol.toStringTag]}.String`;
    }

    protected __set(v: any): string
    {
        return String(v).padEnd(this.$.min, ' ').substr(0, this.$.max);
    }

    public static min(i: number): typeof Type
    {
        if(Number.isInteger(i) === false)
        {
            throw new Error(`Expected an integer, got '${i}'`);
        }

        return this._configure('min', i);
    }

    public static max(i: number): typeof Type
    {
        if(Number.isInteger(i) === false)
        {
            throw new Error(`Expected an integer, got '${i}'`);
        }

        return this._configure('max', i);
    }

    public static [Symbol.hasInstance](v: string|Str): boolean
    {
        return typeof v === 'string' || v.constructor === this;
    }
}