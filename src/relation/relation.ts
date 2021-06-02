import QueuedPromise from '@fyn-software/core/queuedPromise';
import List from '../type/list';
import { ModelConstructor } from '../model/model';
import IModel from '../model/iModel';

export type RelationConstructor<T extends IModel<T>> = Constructor<Relation<T>> & {
    many: boolean;
};

export default abstract class Relation<T extends IModel<T>> extends List<any>
{
    public static get many(): boolean
    {
        return true;
    }

    protected __set(v: QueuedPromise|any): T|Array<T>
    {
        v =  v instanceof QueuedPromise
            ? v
            : new QueuedPromise(v instanceof Promise ? v : Promise.resolve(v));

        return v.then((v: T) => {
            return super.__set((this.constructor as RelationConstructor<T>).many ? v : [ v ]);
        });
    }

    protected __get(v: any): any
    {
        v = super.__get(v);

        return (this.constructor as RelationConstructor<T>).many ? v : v[0];

        // if(this.#fetched === false)
        // {
        //     this.#fetched = true;
        //
        //     let query = this.target;
        //     const args = {};
        //
        //     for(const [ local, foreign ] of Object.entries(this.bindings ?? {}))
        //     {
        //         query = query.where(this.target[foreign].isEqualTo(`@${foreign}`));
        //         args[foreign] = this._owner[local];
        //     }
        //
        //     const value = query[this.constructor.many ? 'findAll' : 'find'](args);
        //
        //     if(this.constructor.many)
        //     {
        //         v = this.$.value = Array.fromAsync(value);
        //
        //         this.setValue(v);
        //     }
        //     else
        //     {
        //         v = this.$.value = this.setValue([ value ]);
        //     }
        // }
        //
        // return new QueuedPromise(v instanceof Promise ? v : Promise.resolve(v));
    }

    public static ownedBy<T extends IModel<T>>(owner: Constructor<T>): typeof Relation
    {
        return this._configure('ownedBy', owner) as unknown as typeof Relation;
    }

    public static targets<T extends IModel<T>>(target: ModelConstructor<T>): typeof Relation
    {
        return super.type(target) as unknown as typeof Relation;
    }

    public static maps(conf: any): typeof Relation
    {
        return this._configure('bindings', conf) as unknown as typeof Relation;
    }
}