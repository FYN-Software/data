import { equals } from '../../core/extends.js';

const value = Symbol('value');
const setter = Symbol('setter');
const renderers = Symbol('renderers');

export default class Type extends EventTarget
{
    constructor()
    {
        super();

        this[setter] = v => v;
        this[renderers] = new Map();
    }

    [Symbol.toPrimitive](hint)
    {
        // console.log(hint);

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
        if(v instanceof Promise)
        {
            v.then(v => this.default(v));
        }
        else
        {
            this[value] = this.__set(this[setter].apply(this, [ v ]));
        }

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
        if(v instanceof Promise)
        {
            return v.then(v => this.__value = v);
        }

        const old = this[value];

        this[value] = this.__set(this[setter].apply(this, [ v ]));

        if(equals(old, this[value]) === false)
        {
            this.emit('changed', { old, new: this[value] });
        }
    }

    get renders()
    {
        return this[renderers];
    }
}