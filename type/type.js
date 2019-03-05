import '../../core/extends.js';

const value = Symbol('value');
const setter = Symbol('setter');

export default class Type extends EventTarget
{
    constructor()
    {
        super();

        this[setter] = v => v;
    }

    [Symbol.toPrimitive]()
    {
        return this[value];
    }

    [Symbol.toStringTag]()
    {
        return this.constructor.name;
    }

    set(cb)
    {
        if(typeof cb !== 'function')
        {
            throw new Error(`Expected a callable, got '${cb}'`);
        }

        this[setter] = cb;

        return this;
    }

    static set(cb)
    {
        return (new this).set(cb);
    }

    __set(v)
    {
        return v;
    }

    default(v)
    {
        this[value] = this.__set(this[setter].apply(this, [ v ]));

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

        this[value] = this.__set(this[setter].apply(this, [ v ]));

        if(old !== this[value])
        {
            this.emit('changed', { old, new: this[value] });
        }
    }
}