import { equals, clone } from '../../core/extends.js';

export default class Type extends EventTarget
{
    static config = { };

    #name = '';

    constructor(defaults = {})
    {
        super();

        const config = { ...{ setter: v => v, value: null }, ...defaults, ...this.constructor.config };

        for(const name of [ ...Object.keys(config).filter(n => n !== 'value'), 'value' ])
        {
            const value = name === 'value'
                ? this.__set(this.setter(config[name]))
                : config[name];

            Object.defineProperty(this, name, {
                value,
                writable: true,
                enumerable: true,
                configurable: false,
            });
        }
    }

    [Symbol.toPrimitive](hint)
    {
        return this.value;
    }

    get [Symbol.toStringTag]()
    {
        return 'Type';
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

        const old = this.value;

        this.value = this.__set(this.setter.apply(this, [ v ]));

        if(equals(old, this.value) === false)
        {
            this.emit('changed', { old, new: this.value });
        }
    }

    static set(cb)
    {
        if(typeof cb !== 'function')
        {
            throw new Error(`Expected a callable, got '${cb}'`);
        }

        return this._configure('setter', cb);
    }

    static default(value)
    {
        return this._configure('value', value);
    }

    set name(n)
    {
        this.#name = n;
    }

    static _configure(name, value)
    {
        const owner = this;
        const self = this.hasOwnProperty('__configurator__')
            ? this
            : class extends owner {
                static config = clone(owner.config);
            };

        self.config[name] = value;

        return self;
    }
}