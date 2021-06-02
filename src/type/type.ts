import { equals, clone } from '@fyn-software/core/extends';

const baseConfig: TypeConfig = { getter: v => v, setter: v => v, value: null };

export default class Type extends EventTarget implements IType
{
    public static config: TypeConfig = { };

    private value = null;
    private readonly config: TypeConfig;

    public constructor(defaults: TypeConfig = {}, value: any = undefined)
    {
        super();

        const config = { ...baseConfig, ...defaults, ...(this.constructor as TypeConstructor).config };
        value ??= config['value'];

        Object.defineProperty(config, 'value', {
            get: () => this.__get(this.$.getter!.apply(this, [ this.value ])),
            set: v => this.value = this.__set(this.$.setter!.apply(this, [ v ])),
            enumerable: true,
            configurable: false,
        });

        this.config = config;
        this.$.value = value;
    }

    public [Symbol.toPrimitive](hint: string): any
    {
        return this.$.value;
    }

    public get [Symbol.toStringTag](): string
    {
        return 'Type';
    }

    public get $(): TypeConfig
    {
        return this.config;
    }

    protected __get(v: any): any
    {
        return v;
    }
    protected __set(v: any): any
    {
        return v;
    }

    public async setValue<T>(v: T): Promise<T>
    {
        const old = this.value;

        this.$.value = await v;

        if(equals(old, this.value) === false)
        {
            this.emit('changed', { old, new: this.$.value });
        }

        return v;
    }

    public static get(cb: (value: any) => any): TypeConstructor
    {
        return this._configure('getter', cb);
    }

    public static set(cb: (value: any) => any): TypeConstructor
    {
        return this._configure('setter', cb);
    }

    public static default(value: any): TypeConstructor
    {
        return this._configure('value', value);
    }

    protected static _configure(name: string, value: any): TypeConstructor
    {
        const owner = this;
        const self = this.hasOwnProperty('__configurator__')
            ? this
            : class extends owner {
                static __configurator__: void;
                static config: TypeConfig = clone(owner.config);
            };

        self.config[name] = value;

        return self;
    }

    public static get Any(): typeof Any
    {
        return Any;
    }
}

export class Any extends Type
{
    public constructor(value: any)
    {
        super({ value: null }, value);
    }

    public static [Symbol.hasInstance]()
    {
        return true;
    }
}