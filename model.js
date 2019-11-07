import Query from './query/query.js';
import Type from './type/type.js';
import ObjectType from './type/object.js';

export default class Model extends ObjectType
{
    static get properties()
    {
        return {};
    }

    #sources = new Map();
    // #fields = {};
    #query = new Query(this);
    #raw = false;

    constructor(sources)
    {
        super({ template: new.target.properties });

        this.#sources = new Map(Object.entries(sources));

        // for(let [k, v] of Object.entries(this.constructor.properties))
        // {
        //     if((v instanceof Type) === false && v.prototype instanceof Type)
        //     {
        //         v = new v;
        //     }
        //
        //     if((v instanceof Type) === false)
        //     {
        //         throw new Error(`Model properties are expected to be typed, got '${v}'`);
        //     }
        //
        //     this.#fields[k] = v;
        //
        //     Object.defineProperty(this, k, {
        //         get: () => this.#fields[k].value,
        //         set: this.#fields[k].setValue.bind(this.#fields[k]),
        //     })
        // }
    }

    async *fetch(query, args)
    {
        yield* this.#sources.get('default').fetch(query, args);
    }

    static fromData(data)
    {
        const inst = new this;

        for(const [k, v] of Object.entries(data))
        {
            if(inst.hasOwnProperty(k) === false)
            {
                continue;
            }

            inst[k] = v;
        }

        return inst;
    }

    save()
    {
        throw new Error(`TODO: Implement method`);
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
            : this.constructor.fromData(v);
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
            yield this.constructor.fromData(r);
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
        return new this.find(...args);
    }
    static async *findAll(...args)
    {
        yield* new this.findAll(...args);
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
    }
}