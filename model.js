// import Field from './types/field.js';
// import HasMany from './types/hasMany.js';
// import HasOne from './types/hasOne.js';
// import OwnsMany from './types/ownsMany.js';
// import Relation from './types/relation.js';

export default class Model
{
    static get properties()
    {
        return {};
    }

    constructor(adapter)
    {
        this._adapter = adapter;
        this._fields = {};
        this._methods = {};

        for(let [k, v] of Object.entries(this.constructor.properties))
        {
            this._fields[k] = { _name: k, value: v };

            // if(v instanceof Relation)
            // {
            //     v.owner = this;
            // }

            Object.defineProperty(this, k, {
                get: () => this._fields[k].value,
                set: v => this._fields[k].value = v,
            })
        }

        this._limit = null;
    }

    fetch(args)
    {
        return this._adapter.read(args);
    }

    static fromData(data)
    {
        const inst = new this;
        const fields = Object.values(inst._fields);

        for(let [k, v] of Object.entries(data))
        {
            const field = fields.find(f => f._name === k);

            if(field === undefined)
            {
                continue;
            }

            inst[k] = v;
            // field.populate(v);
        }

        return inst;
    }

    save()
    {
        const m = Object.values(this._fields).every(f => f.new)
            ? 'insert'
            : 'update';

        this[m](Object.entries(this._fields).reduce((t, [k, v]) => ({ ...t, [k]: v.value }), {}));
    }

    delete(data)
    {
        console.log('Deleting', data);
    }

    from(identifier)
    {
        return this;
    }
    where(...args)
    {
        this._adapter.where(...args)

        return this;
    }
    select(...args)
    {
        return this;
    }
    order(...args)
    {
        return this;
    }
    groupBy(...args)
    {
        return this;
    }

    limit(l)
    {
        this._limit = l;

        return this;
    }
    find(args = {})
    {
        return this.fetch(args).then(r => r.length === 0 ? null : this.constructor.fromData(r[0]));
    }
    findAll(args = {})
    {
        return this.fetch(args).then(r => (r || []).map(e => this.constructor.fromData(e)));
    }

    resolveName(name)
    {
        return this._fields[name]._name;
    }

    static store(data)
    {
        return new this();
    }
    static from(identifier)
    {
        return new this().from(identifier);
    }
    static where(...args)
    {
        return (new this).where(...args);
    }
    static select(...args)
    {
        return new this().select(...args);
    }
    static order(...args)
    {
        return new this().order(...args);
    }
    static limit(...args)
    {
        return new this().limit(...args);
    }
    static groupBy(...args)
    {
        return new this().groupBy(...args);
    }
    static find(...args)
    {
        return new this().find(...args);
    }
    static findAll(...args)
    {
        return new this().findAll(...args);
    }



    // static hasMany(target)
    // {
    //     return new HasMany(this, target);
    // }
    //
    // static ownsMany(target)
    // {
    //     return new OwnsMany(this, target);
    // }
    //
    // static hasOne(target)
    // {
    //     return new HasOne(this, target);
    // }
    //
    // static ownsOne(target)
    // {
    //     return new OwnsOne(this, target);
    // }
}