import Relation from './relation.js';
export default class OwnsOne extends Relation {
    static get many() {
        return false;
    }
}
