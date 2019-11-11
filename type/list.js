import item from '../../suite/js/common/navigation/item.js';
import Type from './type.js';

export default class List extends Type
{
    #queue = [];

    constructor(value)
    {
        super({ value: value || [], type: Type.Any });
    }

    __set(v)
    {
        if(Array.isArray(v) === false)
        {
            throw new Error(`Expected an 'Array', got '${v.constructor.name}'`);
        }

        if(this.type !== null && v.some(i => (i instanceof this.type) === false))
        {
            throw new Error(`Not all items are of type '${this.type.name}'`);
        }

        return new Proxy(this.normalize(v), {
            get: (target, property) => {
                switch (property)
                {
                    case Symbol.iterator:
                        return this[Symbol.iterator];

                    case 'push':
                        return this.typeCheck(target, property);

                    default:
                        return target[property];
                }
            },
        });
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
        return items.map(i => i && i[Symbol.toStringTag] !== undefined ? i : new this.type(i));
    }

    static [Symbol.hasInstance](v)
    {
        return Array.isArray(v) || v.constructor === this;
    }

    get [Symbol.iterator]()
    {
        let value = this.value.map(i => i.value);

        return value[Symbol.iterator].bind(value);
    }

    async *[Symbol.asyncIterator]()
    {
        outer:
        for(let item of this.value.map(i => i.value))
        {
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