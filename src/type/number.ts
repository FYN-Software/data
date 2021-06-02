import Type from './type';

export default class Num extends Type
{
    public constructor(value: any)
    {
        super({ value: 0, min: -Infinity, max: Infinity }, value);
    }

    protected __set(v: any): number
    {
        if(Number.isNaN(v) === true)
        {
            throw new Error(`Given value '${v}' is NaN`);
        }

        return v.clamp(this.$.min, this.$.max);
    }

    public static min(i: number): typeof Type
    {
        return this._configure('min', i);
    }

    public static max(i: number): typeof Type
    {
        return this._configure('max', i);
    }

    public static [Symbol.hasInstance](v: number|Num): boolean
    {
        return typeof v === 'number' || v.constructor === this;
    }
}