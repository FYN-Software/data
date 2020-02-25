import Query from './query/query.js';
import HasMany from './relation/hasMany.js';
import HasOne from './relation/hasOne.js';
import OwnsMany from './relation/ownsMany.js';
import OwnsOne from './relation/ownsOne.js';
import ObjectType from './type/object.js';

export default class Model extends ObjectType
{
    static get properties()
    {
        return {};
    }
    static get sources()
    {
        throw new Error(`Not implemented`);
    }

    #sources = new Map();
    #query = new Query(this);
    #source = 'default';
    #raw = false;

    constructor(value)
    {
        super(value);

        this.#sources = new Map(Object.entries(this.constructor.sources));

        for(const source of this.#sources.values())
        {
            source.owner = this;
        }
    }

    toTransferable()
    {
        return {
            name: this.value.name,
            start: this.value.start,
            end: this.value.end,
            link: this.value.link,
            image: this.value.image,
        };
    }

    async *fetch(query, args)
    {
        yield* this.#sources.get(this.#source).fetch(query, args);
    }

    async save()
    {
        try
        {
            await Array.fromAsync(this.fetch(new Query(this).insert(), {}));

            return true;
        }
        catch
        {
            return false;
        }
    }

    async find(query, args = {})
    {
        const iterator = this.fetch(query, args);
        const v = (await iterator.next()).value;

        iterator.return();

        if(this.#raw === true)
        {
            return r;
        }

        return v === undefined
            ? null
            : new this.constructor(v);
    }
    async *findAll(query, args = {})
    {
        if(this.#raw === true)
        {
            yield* this.fetch(query, args);

            return;
        }

        for await (const r of this.fetch(query, args))
        {
            yield (new this.constructor(r));
        }
    }

    static where(...args)
    {
        return new Query(new this).where(...args);
    }
    static select(...args)
    {
        return new Query(new this).select(...args);
    }
    static order(...args)
    {
        return new Query(new this).order(...args);
    }
    static limit(...args)
    {
        return new Query(new this).limit(...args);
    }
    static async find(...args)
    {
        return new Query(new this).find(...args);
    }
    static async *findAll(...args)
    {
        yield* (new Query(new this).findAll(...args));
    }

    static hasMany(target)
    {
        return HasMany.ownedBy(this).targets(target);
    }
    static ownsMany(target)
    {
        return OwnsMany.ownedBy(this).targets(target);
    }
    static hasOne(target)
    {
        return HasOne.ownedBy(this).targets(target);
    }
    static ownsOne(target)
    {
        return OwnsOne.ownedBy(this).targets(target);
    }

    static withSources(sources)
    {
        if(typeof sources !== 'object' || sources.hasOwnProperty('default') === false)
        {
            throw new Error(`Invalid source definition for '${this.name}', expected at least a source with 'default' as key`);
        }

        return this._configure('sources', sources);
    }

    static initialize(model)
    {
        if((model.prototype instanceof this) === false)
        {
            throw new Error(`Expected a '${this.name}', got '${model}' instead`);
        }

        const Field = class Field
        {
            #name;
            #type;
            #operator;
            #value;

            constructor(name, type)
            {
                this.#name = name;
                this.#type = type;
            }

            [Symbol.toPrimitive](hint)
            {
                if(hint === 'string')
                {
                    return [ `$${this.#name}`, this.#operator, this.#value ].join(' ');
                }

                return this;
            }

            isEqualTo(value)
            {
                this.#operator = '=';
                this.#value = value;

                return this;
            }

            isNotEqualTo(value)
            {
                this.#operator = '!=';
                this.#value = value;

                return this;
            }

            isGreaterThan(value)
            {
                this.#operator = '>';
                this.#value = value;

                return this;
            }

            isGreaterThanOrEqualTo(value)
            {
                this.#operator = '>=';
                this.#value = value;

                return this;
            }

            isLessThan(value)
            {
                this.#operator = '<';
                this.#value = value;

                return this;
            }

            isLessThanOrEqualTo(value)
            {
                this.#operator = '<=';
                this.#value = value;

                return this;
            }

            get asc()
            {
                this.#operator = 'ASC';

                return this;
            }

            get desc()
            {
                this.#operator = 'DESC';

                return this;
            }

            get name()
            {
                return this.#name;
            }

            get type()
            {
                return this.#type;
            }

            get operator()
            {
                return this.#operator;
            }

            get value()
            {
                return this.#value;
            }
        };

        for(const [ name, type ] of Object.entries(model.properties))
        {
            Object.defineProperty(model, name, {
                value: new Field(name, type),
                writable: false,
                enumerable: true,
            });
        }

        const properties = { ...model.properties };

        for(const [ name, descriptor ] of Object.entries(Object.getOwnPropertyDescriptors(model.prototype)))
        {
            if (descriptor.get === undefined)
            {
                continue;
            }

            Object.defineProperty(properties, name, descriptor);
        }

        return model.withSources(model.sources).define(properties);
    }
}