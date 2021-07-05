import { ModelConstructor } from '../model/model';
export declare type RelationConstructor<T extends IModel<T>> = Constructor<Relation<T>> & {
    many: boolean;
};
export default abstract class Relation<T extends IModel<T>> implements IRelation {
    static get many(): boolean;
    static ownedBy<T extends IModel<T>>(owner: Constructor<T>): typeof Relation;
    static targets<T extends IModel<T>>(target: ModelConstructor<T>): typeof Relation;
    static maps(conf: any): typeof Relation;
}
//# sourceMappingURL=relation.d.ts.map