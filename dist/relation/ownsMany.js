import Relation from './relation.js';
export default class OwnsMany extends Relation {
    static get many() {
        return true;
    }
}
