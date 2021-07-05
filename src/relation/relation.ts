import QueuedPromise from '@fyn-software/core/queuedPromise';
import { ModelConstructor } from '../model/model';

export type RelationConstructor<T extends IModel<T>> = Constructor<Relation<T>> & {
    many: boolean;
};

export default abstract class Relation<T extends IModel<T>> implements IRelation
{
    public static get many(): boolean
    {
        return true;
    }

    public static ownedBy<T extends IModel<T>>(owner: Constructor<T>): typeof Relation
    {
        return this;//this._configure('ownedBy', owner) as unknown as typeof Relation;
    }

    public static targets<T extends IModel<T>>(target: ModelConstructor<T>): typeof Relation
    {
        return this;//super.type(target) as unknown as typeof Relation;
    }

    public static maps(conf: any): typeof Relation
    {
        return this;//this._configure('bindings', conf) as unknown as typeof Relation;
    }
}