import { equals, clone } from '../../core/extends.js';

const baseConfig = { getter: v => v, setter: v => v, value: null };

export default class Type extends EventTarget
{
    static config = { };

    #name = '';
    #owner = null;
    #value = null;
    #config = {};

    constructor(defaults = {}, value = undefined)
    {
        super();

        const config = { ...baseConfig, ...defaults, ...this.constructor.config };
        value ??= config['value'];

        Object.defineProperty(config, 'value', {
            get: () => this.__get(this.$.getter.apply(this, [ this.#value ])),
            set: v => this.#value = this.__set(this.$.setter.apply(this, [ v ])),
            enumerable: true,
            configurable: false,
        });

        this.#config = config;
        this.$.value = value;
    }

    [Symbol.toPrimitive](hint)
    {
        return this.$.value;
    }

    get [Symbol.toStringTag]()
    {
        return 'Type';
    }

    get $()
    {
        return this.#config;
    }

    __get(v)
    {
        return v;
    }
    __set(v)
    {
        return v;
    }

    async setValue(v)
    {
        const old = this.#value;

        this.$.value = await v;

        if(equals(old, this.#value) === false)
        {
            this.emit('changed', { old, new: this.$.value });
        }

        return v;
    }

    static get(cb)
    {
        if(typeof cb !== 'function')
        {
            throw new Error(`Expected a callable, got '${cb}'`);
        }

        return this._configure('getter', cb);
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

    set _name(n)
    {
        this.#name = n;
    }

    get _owner()
    {
        return this.#owner;
    }

    set _owner(o)
    {
        this.#owner = o;
    }

    static _configure(name, value)
    {
        const owner = this;
        const self = this.hasOwnProperty('__configurator__')
            ? this
            : class extends owner {
                static __configurator__;
                static config = clone(owner.config);
            };

        self.config[name] = value;

        return self;
    }

    static get Any()
    {
        return Any;
    }
}

export class Any extends Type
{
    constructor(value)
    {
        super({ value: null }, value);
    }

    static [Symbol.hasInstance]()
    {
        return true;
    }
}