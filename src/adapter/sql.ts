import Adapter from './adapter';
import Query from '../query/query';
import Model from '../model/model';

const map = {
    order: 'ORDER BY',
    limit: 'LIMIT',
    select: 'SELECT',
    from: 'FROM',
    where: 'WHERE',
    group: 'GROUP BY',
};

export default class Sql extends Adapter
{
    constructor()
    {
        super();
    }

    compile<T extends Model<T>>(query: Query<T>): string
    {
        const methods = query.methods
            .map(([ method, value ]: [string, any]) => `${map[method as keyof object]} ${value}`)
            .join(' ');

        return `SELECT * FROM \`$database\`.\`$table\` ${methods}`;
    }
}