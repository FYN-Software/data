import Relation from './relation.js';

export default class HasOne extends Relation
{
    static get many()
    {
        return false;
    }
}