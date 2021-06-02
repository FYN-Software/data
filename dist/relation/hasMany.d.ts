import Relation from './relation.js';
import Model from '../model/model.js';
export default class HasMany<T extends Model<T>> extends Relation<T> {
    static get many(): boolean;
}
//# sourceMappingURL=hasMany.d.ts.map