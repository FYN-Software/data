import Adapter from './adapter';
import Query from '../query/query';
import Model from '../model/model';
export default class Sql extends Adapter {
    constructor();
    compile<T extends Model<T>>(query: Query<T>): string;
}
//# sourceMappingURL=sql.d.ts.map