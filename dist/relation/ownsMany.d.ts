import Relation from './relation.js';
export default class OwnsMany<T extends IModel<T>> extends Relation<T> {
    static get many(): boolean;
}
//# sourceMappingURL=ownsMany.d.ts.map