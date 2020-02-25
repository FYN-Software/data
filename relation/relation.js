import QueuedPromise from '../../core/queuedPromise.js';
import Type from '../type/type.js';

export default class Relation extends Type
{
    #fetched = false;

    static get many()
    {
        return true;
    }

    constructor(value)
    {
        super({}, value);
    }

    __set(v)
    {
        if(v !== null)
        {
            if(this.constructor.many)
            {
                console.log(v.map(i => new this.target(i)));
            }
            else
            {
                console.info('Implement non-many relation value setter');
                console.log(v);
            }
        }

        return v instanceof QueuedPromise
            ? v
            : new QueuedPromise(v instanceof Promise ? v : Promise.resolve(v));
    }

    __get(v)
    {
        if(this.#fetched === false)
        {
            this.#fetched = true;

            let query = this.target;
            const args = {};

            for(const [ local, foreign ] of Object.entries(this.bindings))
            {
                query = query.where(this.target[foreign].isEqualTo(`@${foreign}`));
                args[foreign] = this._owner[local];
            }

            const value = query[this.constructor.many ? 'findAll' : 'find'](args);

            if(this.constructor.many)
            {
                v = this.value = Array.fromAsync(value);

                this.setValue(v);
            }
            else
            {
                v = this.value = this.setValue(value);
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
        return this._configure('target', target);
    }

    static maps(conf)
    {
        return this._configure('bindings', conf);
    }
}