import HasMany from './relation/hasMany.js';
import HasOne from './relation/hasOne.js';
import OwnsMany from './relation/ownsMany.js';
import Relation from './relation/relation.js';
import Type from './type/type.js';

const adapter = Symbol('adapter');
const fields = Symbol('fields');
const methods = Symbol('methods');

export default class Model extends Type
{
    static get properties()
    {
        return {};
    }

    constructor(a)
    {
        super();

        this[adapter] = a;
        this[fields] = {};
        this[methods] = {};

        for(let [k, v] of Object.entries(this.constructor.properties))
        {
            if((v instanceof Type) === false)
            {
                throw new Error(`Model properties are expected to be typed, got '${v}'`);
            }

            this[fields][k] = v;

            if(v instanceof Relation)
            {
                v.owner = this;
            }

            Object.defineProperty(this, k, {
                get: () => this[fields][k],
                set: v => this[fields][k].__value = v,
            })
        }
    }

    fetch(args)
    {
        return this[adapter].read(args);
    }

    static fromData(data)
    {
        const inst = new this;

        for(let [k, v] of Object.entries(data))
        {
            if(inst[fields].hasOwnProperty(k) === false)
            {
                continue;
            }

            inst[k] = v;
        }

        return inst;
    }

    save()
    {
        const m = Object.values(this[fields]).every(f => f.new)
            ? 'insert'
            : 'update';

        this[m](Object.entries(this[fields]).reduce((t, [k, v]) => ({ ...t, [k]: v.value }), {}));
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
        this[methods].push([ 'where', args ]);

        return this;
    }
    select(...args)
    {
        this[methods].push([ 'select', args ]);

        return this;
    }
    order(...args)
    {
        this[methods].push([ 'order', args ]);

        return this;
    }
    groupBy(...args)
    {
        this[methods].push([ 'groupBy', args ]);

        return this;
    }

    limit(l)
    {
        this[methods].push([ 'limit', args ]);

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
        return this[fields][name];
    }

    async toComponent()
    {
        const component = new (Component.register(this.constructor.view, `${this.constructor.name.toLowerCase()}-model`));

        const form = new Form;

        for(const [ key, prop ] of Object.entries(this[fields]))
        {
            prop.name = key;
            form.appendChild(await prop.toComponent());
        }

        const submit = new Button;
        submit.textContent = 'Save';
        submit.slot = 'buttons';
        submit.setAttribute('action', 'submit');
        submit.setAttribute('primary', '');
        form.appendChild(submit);

        const cancel = new Button;
        cancel.textContent = 'Cancel';
        cancel.setAttribute('action', 'cancel');
        cancel.slot = 'buttons';
        form.appendChild(cancel);

        component.appendChild(form);

        return component;
    }

    static get view()
    {
        const props = this.constructor.properties;

        return class extends Component
        {
            constructor()
            {
                super(Promise.resolve(null));

                const style = document.createElement('style');
                style.innerText = ':host { display: contents; }';

                const slot = document.createElement('slot');

                this.shadow.appendChild(style);
                this.shadow.appendChild(slot);
            }
        }
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



    static hasMany(target)
    {
        return new HasMany(this, target);
    }

    static ownsMany(target)
    {
        return new OwnsMany(this, target);
    }

    static hasOne(target)
    {
        return new HasOne(this, target);
    }

    static ownsOne(target)
    {
        return new OwnsOne(this, target);
    }
}