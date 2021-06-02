import QueuedPromise from '@fyn-software/core/queuedPromise';
import List from '../type/list';
import { ModelConstructor } from '../model/model';
import IModel from '../model/iModel';
export declare type RelationConstructor<T extends IModel<T>> = Constructor<Relation<T>> & {
    many: boolean;
};
export default abstract class Relation<T extends IModel<T>> extends List<any> {
    static get many(): boolean;
    protected __set(v: QueuedPromise | any): T | Array<T>;
    protected __get(v: any): any;
    static ownedBy<T extends IModel<T>>(owner: Constructor<T>): typeof Relation;
    static targets<T extends IModel<T>>(target: ModelConstructor<T>): typeof Relation;
    static maps(conf: any): typeof Relation;
}
//# sourceMappingURL=relation.d.ts.map