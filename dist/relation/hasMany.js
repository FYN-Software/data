import Relation from './relation.js';
export default class HasMany extends Relation {
    static get many() {
        return true;
    }
}
