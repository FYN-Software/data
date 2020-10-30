import Type, { Any } from './type.js';

export default class List extends Type
{
    #queue = [];

    constructor(value)
    {
        super({ value: [], type: Type.Any }, value);
    }

    __set(v)
    {
        if(Array.isArray(v) === false)
        {
            if(typeof v === 'string')
            {
                v = JSON.tryParse(v.replace(/'/g, '"'));
            }
            else if(typeof v[Symbol.iterator] === 'function')
            {
                v = Array.from(v);
            }
            else if(typeof v[Symbol.asyncIterator] === 'function')
            {
                if(v.hasOwnProperty('__marker__') === true)
                {
                    return v;
                }

                const self = this;

                return new class
                {
                    __marker__;
                    #value;

                    async find(precondition)
                    {
                        for await (const item of this)
                        {
                            if((await precondition(item)) === true)
                            {
                                return item;
                            }
                        }
                    }

                    async join(separator)
                    {
                        const items = [];
                        for await (const item of this)
                        {
                            items.push(item);
                        }

                        return items.join(separator);
                    }

                    async *map(callback)
                    {
                        let i = 0;
                        for await (const item of this)
                        {
                            yield await callback(item, i);

                            i++;
                        }

                        return this;
                    }

                    async *filter(callback)
                    {
                        let i = 0;
                        for await (const item of this)
                        {
                            if((await callback(item, i)) === true)
                            {
                                yield item;
                            }

                            i++;
                        }

                        return this;
                    }

                    async *[Symbol.asyncIterator]()
                    {
                        const value = [];

                        for await (let item of this.#value ?? v)
                        {
                            if(this.#value === undefined)
                            {
                                item = item[Symbol.toStringTag]?.startsWith('Type') ? item : new self.$.type(item);
                                item.on({ changed: d => self.emit('changed', d) })
                                value.push(item);
                            }

                            yield item;
                        }

                        if(this.#value === undefined)
                        {
                            this.#value = value;
                        }
                    }
                }

                // return Array.fromAsync(v).then(v => this.__set(v));
            }
            else
            {
                throw new Error(`Expected an 'Array', got '${v.constructor.name}'`);
            }
        }

        try
        {
            v.some(i => (i instanceof this.$.type) === false)
        }
        catch (e)
        {
            console.log(v);

            throw e;
        }

        if(this.$.type !== null && v.some(i => (i instanceof this.$.type) === false))
        {
            throw new Error(`Not all items are of type '${this.$.type.name}'`);
        }

        v = this.normalize(v);

        for(const type of v)
        {
            type.on({
                changed: d => this.emit('changed', d),
            })
        }

        return new Proxy(v, {
            get: (target, property) => {
                if (typeof property === 'string' && Number.isInteger(Number.parseInt(property)) && target[property] instanceof Type)
                {
                    return target[property] && target[property].$.value;
                }

                switch (property)
                {
                    case Symbol.iterator:
                        return target[Symbol.iterator].bind(target);

                    case Symbol.asyncIterator:
                        return this[Symbol.asyncIterator].bind(this);

                    case 'groupBy':
                        return k => this.$.value.reduce(
                            (t, i) => {
                                (t[i[k]] = t[i[k]] || []).push(i);

                                return t;
                            },
                            {}
                        );

                    case 'push':
                    case 'unshift':
                        return this.typeCheck(target, property);

                    case 'first':
                    case 'last':
                        return target[property].$.value;

                    default:
                        return target[property];
                }
            },
        });
    }

    [Symbol.toPrimitive](hint)
    {
        switch (hint)
        {
            case 'transferable':
            case 'clone':
            {
                return Array.from(this.$.value, i => i[Symbol.toPrimitive](hint));
            }

            default:
                return this.$.value;
        }
    }

    get [Symbol.toStringTag]()
    {
        return `${super[Symbol.toStringTag]}.List`;
    }

    filter(callback)
    {
        this.#queue.push([ 'filter', callback ]);

        return this;
    }

    map(callback)
    {
        this.#queue.push([ 'map', callback ]);

        return this;
    }

    typeCheck(target, method)
    {
        return (...items) => {
            if(items.some(i => (i instanceof this.type) === false))
            {
                throw new Error(`Not all items are of type '${this.type.name}'`);
            }

            return target[method].apply(target, this.normalize(items));
        }
    }

    normalize(items)
    {
        return items.map(i => i && i[Symbol.toStringTag] !== undefined && i[Symbol.toStringTag].startsWith('Type') ? i : new this.$.type(i));
    }

    static [Symbol.hasInstance](v)
    {
        return Array.isArray(v) || v.constructor === this;
    }

    get [Symbol.iterator]()
    {
        return this.$.value[property].bind(this.$.value);
    }

    async *[Symbol.asyncIterator]()
    {
        outer:
        for(let item of this.$.value)
        {
            if(item.constructor.name === 'Any')
            {
                item = item.$.value;
            }

            for(const [method, callback] of this.#queue)
            {
                switch (method)
                {
                    case 'filter':
                        if(Boolean(await callback(item)) === false)
                        {
                            continue outer;
                        }

                        break;

                    case 'map':
                        item = await callback(item);

                        break;
                }
            }

            yield item;
        }

        this.#queue = [];
    }

    static type(t)
    {
        if((t.prototype instanceof Type) === false)
        {
            throw new Error(`expected '${Type.name}' got '${t.name}' instead`);
        }

        return this._configure('type', t);
    }
}