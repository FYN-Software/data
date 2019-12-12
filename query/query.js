import Enum from '../type/enum.js';

export default class Query
{
    #target;
    #methods = [];

    constructor(target)
    {
        this.#target = target;
    }

    *[Symbol.iterator]()
    {
        for (const method of this.#methods)
        {
            yield method;
        }
    }

    get methods()
    {
        return this.#methods;
    }

    async find(args = {})
    {
        return this.limit(1).#target.find(this, args);
    }
    async *findAll(args = {})
    {
        yield* this.#target.findAll(this, args);
    }

    where(...args)
    {
        this.#methods.push([ 'where', args ]);

        return this;
    }
    select(...args)
    {
        this.#methods.push([ 'select', args ]);

        return this;
    }
    order(...args)
    {
        this.#methods.push([ 'order', args ]);

        return this;
    }
    limit(...args)
    {
        this.#methods.push([ 'limit', args ]);

        return this;
    }

    static where(model, ...args)
    {
        return new this(model).where(...args);
    }
    static select(model, ...args)
    {
        return new this(model).select(...args);
    }
    static order(model, ...args)
    {
        return new this(model).order(...args);
    }
    static limit(model, ...args)
    {
        return new this(model).limit(...args);
    }
}

export const Order = Enum.define({
    asc: 'asc',
    desc: 'desc',
});