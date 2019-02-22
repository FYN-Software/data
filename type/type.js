import '../../core/extends.js';

const value = Symbol('value');

export default class Type extends EventTarget
{
    constructor()
    {
        super();
    }

    [Symbol.toPrimitive]()
    {
        return this[value];
    }

    [Symbol.toStringTag]()
    {
        return this.constructor.name;
    }

    set(v)
    {
        return v;
    }

    default(v)
    {
        this[value] = this.set(v);

        return this;
    }

    static default(...args)
    {
        return new this().default(...args);
    }

    get __value()
    {
        return this[value];
    }

    set __value(v)
    {
        const old = this[value];

        this[value] = this.set(v);

        if(old !== this[value])
        {
            if(this.constructor.name === 'Enum')
            {
                console.log(old, this[value]);
            }

            this.emit('changed', { old, new: this[value] });
        }
    }
}