import Type from './type';

export default class Bool extends Type
{
    public constructor(value: boolean|undefined)
    {
        super({ value: false, nullable: false }, value);
    }

    protected __set(v: boolean|string|undefined): boolean|undefined
    {
        if(this.$.nullable === true && (v === null || v === undefined))
        {
            return undefined;
        }

        if(typeof v === 'string')
        {
            v = {
                true: true,
                false: false,
            }[v] ?? v;
        }

        return Boolean(v);
    }

    public static [Symbol.hasInstance](v: Bool|boolean): boolean
    {
        return typeof v === 'boolean' || v.constructor === this;
    }

    public static get nullable(): typeof Type
    {
        return this._configure('nullable', true);
    }
}