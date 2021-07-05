import Relation from './relation.js';

export default class HasMany<T extends IModel<T>> extends Relation<T>
{
    static get many()
    {
        return true;
    }
}