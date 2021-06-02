import Relation from './relation.js';
import Model from '../model/model.js';

export default class OwnsMany<T extends Model<T>> extends Relation<T>
{
    static get many()
    {
        return true;
    }
}