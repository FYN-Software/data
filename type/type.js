const value = Symbol('value');

export default class Type extends EventTarget
{
    constructor(v = null)
    {
        super();

        this[value] = this.set(v);

        let lastP;
        const proxy = new Proxy(() => {}, {
            get: (c, p) => {
                if(p === 'then' && (this[value] instanceof Promise) === false)
                {
                    return undefined;
                }

                // NOTE(Chris Kruining)
                // Test if the given property(`p`)
                // exists in the host class(`tbis`)
                {
                    const proto = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this));

                    if(p in proto)
                    {
                        let prop = this[p];

                        if(typeof prop === 'function')
                        {
                            prop = prop.bind(this);
                        }

                        return prop;
                    }
                }

                // NOTE(Chris Kruining)
                // Test if the given property(`p`) exists
                // in the wrapped value(`tbis[value]`)
                {
                    const proto = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this[value]));

                    if(p in proto)
                    {
                        let prop = this[value][p];

                        if(typeof prop === 'function')
                        {
                            prop = prop.bind(this[value]);
                        }

                        return prop;
                    }
                }

                lastP = p;

                return proxy;
            },
            set: (c, p, v) => {
                const old = this[value];

                this[value] = this.set(v);

                if(old !== this[value])
                {
                    this.emit('changed', { old, new: this[value] });
                }

                return true;
            },
            apply: (c, s, a) => {
                const res = this[lastP](...a);

                return res === this
                    ? proxy
                    : res;
            },
            getPrototypeOf: () => this,
        });

        return proxy;
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

    static proxyfy(def)
    {
        return new Proxy(def, {
            get: (c, p) => c[p],
            set: (c, p, v) => this[value] = v,
            apply: (c, s, a) => new c(...a),
        });
    }
}