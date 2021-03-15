export default class Field
{
    #name;
    #type;
    #operator;
    #value;

    constructor(name, type)
    {
        this.#name = name;
        this.#type = type;
    }

    [Symbol.toPrimitive](hint)
    {
        if(hint === 'string')
        {
            return [ `$${this.#name}`, this.#operator, this.#value ].join(' ');
        }

        return this;
    }

    isEqualTo(value)
    {
        this.#operator = '=';
        this.#value = value;

        return this;
    }

    isNotEqualTo(value)
    {
        this.#operator = '!=';
        this.#value = value;

        return this;
    }

    isGreaterThan(value)
    {
        this.#operator = '>';
        this.#value = value;

        return this;
    }

    isGreaterThanOrEqualTo(value)
    {
        this.#operator = '>=';
        this.#value = value;

        return this;
    }

    isLessThan(value)
    {
        this.#operator = '<';
        this.#value = value;

        return this;
    }

    isLessThanOrEqualTo(value)
    {
        this.#operator = '<=';
        this.#value = value;

        return this;
    }

    get asc()
    {
        this.#operator = 'ASC';

        return this;
    }

    get desc()
    {
        this.#operator = 'DESC';

        return this;
    }

    get name()
    {
        return this.#name;
    }

    get type()
    {
        return this.#type;
    }

    get operator()
    {
        return this.#operator;
    }

    get value()
    {
        return this.#value;
    }
}