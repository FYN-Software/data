import QueuedPromise from '../../core/queuedPromise.js';
import List from '../type/list.js';

export default class Relation extends List
{
    #fetched = false;

    static get many()
    {
        return true;
    }

    __set(v)
    {
        v =  v instanceof QueuedPromise
            ? v
            : new QueuedPromise(v instanceof Promise ? v : Promise.resolve(v));

        return v.then(v => {
            return super.__set(this.constructor.many ? v : [ v ]);
        });
    }

    __get(v)
    {
        v = super.__get(v);

        return this.constructor.many ? v : v[0];

        if(this.#fetched === false)
        {
            this.#fetched = true;

            let query = this.target;
            const args = {};

            for(const [ local, foreign ] of Object.entries(this.bindings || {}))
            {
                query = query.where(this.target[foreign].isEqualTo(`@${foreign}`));
                args[foreign] = this._owner[local];
            }

            const value = query[this.constructor.many ? 'findAll' : 'find'](args);

            if(this.constructor.many)
            {
                v = this.$.value = Array.fromAsync(value);

                this.setValue(v);
            }
            else
            {
                v = this.$.value = this.setValue([ value ]);
            }
        }

        return new QueuedPromise(v instanceof Promise ? v : Promise.resolve(v));
    }

    static ownedBy(owner)
    {
        return this._configure('ownedBy', owner);
    }

    static targets(target)
    {
        return super.type(target);
    }

    static maps(conf)
    {
        return this._configure('bindings', conf);
    }
}