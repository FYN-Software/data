import Adapter from './adapter';
const map = {
    order: 'ORDER BY',
    limit: 'LIMIT',
    select: 'SELECT',
    from: 'FROM',
    where: 'WHERE',
    group: 'GROUP BY',
};
export default class Sql extends Adapter {
    constructor() {
        super();
    }
    compile(query) {
        const methods = query.methods
            .map(([method, value]) => `${map[method]} ${value}`)
            .join(' ');
        return `SELECT * FROM \`$database\`.\`$table\` ${methods}`;
    }
}
