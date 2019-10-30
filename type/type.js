import { equals } from '../../core/extends.js';

const value = Symbol('value');

export default class Type extends EventTarget
{
    #setter = v => v;
    #name = '';
    #value = null;

    constructor()
    {
        super();
    }

    [Symbol.toPrimitive](hint)
    {
        return this[value];
    }

    [Symbol.toStringTag]()
    {
        return this.constructor.name;
    }

    async toComponent()
    {
        const component = new (await this.constructor.view);
        component.name = this.#name;
        component.label = this.#name.capitalize();

        return component;
    }

    set(cb)
    {
        if(typeof cb !== 'function')
        {
            throw new Error(`Expected a callable, got '${cb}'`);
        }

        this.#setter = cb;

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

    async setValue(v)
    {
        if(v instanceof Promise)
        {
            v = await v;
        }

        const old = this.#value;

        this.#value = this.__set(this.#setter.apply(this, [ v ]));

        if(equals(old, this.#value) === false)
        {
            this.emit('changed', { old, new: this.#value });
        }
    }

    default(v)
    {
        this.#value = this.__set(this.#setter.apply(this, [ v ]));

        return this;
    }

    static default(...args)
    {
        return new this().default(...args);
    }

    get __value()
    {
        return this.#value;
    }

    set name(n)
    {
        this.#name = n;
    }

    static get view()
    {
        return import('../../suite/js/common/form/input.js').then(m => m.default);
    }
}