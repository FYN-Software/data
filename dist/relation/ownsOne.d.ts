import Relation from './relation.js';
import Model from '../model/model.js';
export default class OwnsOne<T extends Model<T>> extends Relation<T> {
    static get many(): boolean;
}
//# sourceMappingURL=ownsOne.d.ts.map