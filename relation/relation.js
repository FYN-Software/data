export default class Relation
{
    static get many()
    {
        return true;
    }

    constructor(owner, target)
    {
        this._owner = owner;
        this._target = target;
        this._value;
    }

    set owner(o)
    {
        this._owner = o;
    }

    get value()
    {
        if(this._value === undefined)
        {
            let values = {};
            let wheres = [];
            let target = new this._target;

            for(let [ local, foreign ] of Object.entries(this._bindings))
            {
                values[local] = this._owner[local];
                wheres.push(`\`${target.resolveName(foreign)}\` = @${local}`);
            }

            this._value = this._target.where(...wheres)[this.constructor.many ? 'findAll' : 'find'](values);
        }

        let queue = [];
        let calls = [];
        const resolve = (item, property) => {
            let r = item[property];

            if(typeof r === 'function')
            {
                r = r.apply(item, ...calls.shift());
            }

            return r;
        };
        const promise = this._value.then(r => queue.reduce(
            (t, q) => t.then(r => Promise.resolve(r !== null && r !== undefined
                ? resolve(r, q)
                : undefined
            )),
            Promise.resolve(r)
        ));

        const proxy = new Proxy(() => {}, {
            get: (c, p) => {
                if((p in promise) === false)
                {
                    queue.push(p);

                    return proxy;
                }

                return promise[p].bind(promise);
            },
            apply: (target, thisArg, args) => {
                calls.push(args)

                return proxy;
            }
        });

        return proxy;
    }

    maps(conf)
    {
        this._bindings = conf;

        return this;
    }
}