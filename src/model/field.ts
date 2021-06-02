import Type from '../type/type';

export default class Field<T extends Type>
{
    private readonly _name: string;
    private readonly _type: Constructor<T>;
    private _operator: string = '';
    private _value: any;

    public constructor(name: string, type: Constructor<T>)
    {
        this._name = name;
        this._type = type;
    }

    public [Symbol.toPrimitive](hint: string): string|Field<T>
    {
        if(hint === 'string')
        {
            return [ `$${this._name}`, this._operator, this._value ].join(' ');
        }

        return this;
    }

    public isEqualTo(value: any): Field<T>
    {
        this._operator = '=';
        this._value = value;

        return this;
    }

    public isNotEqualTo(value: any): Field<T>
    {
        this._operator = '!=';
        this._value = value;

        return this;
    }

    public isGreaterThan(value: any): Field<T>
    {
        this._operator = '>';
        this._value = value;

        return this;
    }

    public isGreaterThanOrEqualTo(value: any): Field<T>
    {
        this._operator = '>=';
        this._value = value;

        return this;
    }

    public isLessThan(value: any): Field<T>
    {
        this._operator = '<';
        this._value = value;

        return this;
    }

    public isLessThanOrEqualTo(value: any): Field<T>
    {
        this._operator = '<=';
        this._value = value;

        return this;
    }

    public get asc(): Field<T>
    {
        this._operator = 'ASC';

        return this;
    }

    public get desc(): Field<T>
    {
        this._operator = 'DESC';

        return this;
    }

    public get name(): string
    {
        return this._name;
    }

    public get type(): Constructor<T>
    {
        return this._type;
    }

    public get operator(): string
    {
        return this._operator;
    }

    public get value(): any
    {
        return this._value;
    }
}