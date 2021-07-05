import Relation from './relation.js';

export default class HasOne<T extends IModel<T>> extends Relation<T>
{
    static get many()
    {
        return false;
    }
}