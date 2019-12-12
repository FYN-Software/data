import Adapter from './adapter.js';

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

    compile(query)
    {
        return `SELECT * FROM \`$database\`.\`$table\` ${query.methods.map(([ method, value ]) => `${map[method]} ${value}`).join(' ')}`;
    }
}