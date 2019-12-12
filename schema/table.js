import Schema from './schema.js';

const map = {
    order: 'ORDER BY',
    limit: 'LIMIT',
    select: 'SELECT',
    from: 'FROM',
    where: 'WHERE',
    group: 'GROUP BY',
};

export default class Table extends Schema
{
    #database;
    #table;
    #columns;

    constructor(database = '', table = '', columns)
    {
        super();

        this.#database = database;
        this.#table = table;
        this.#columns = Object.entries(columns);
    }

    prepare(query)
    {
        try
        {
            query = `SELECT * FROM \`$database\`.\`$table\` ${query.methods.map(([ method, value ]) => `${map[method]} ${value}`).join(' ')}`;

            return query.replace(/\$(\w+)/g, (_, m) => this[m] || this.#columns.find(([k]) => k === m)[1] || new Error(`unexpected field '${m}'`));
        }
        catch (e)
        {
            console.error(query, this);

            throw e;
        }
    }

    async *map(data)
    {
        for await (const r of data)
        {
            const res = {};

            for(const [ key, value ] of Object.entries(r))
            {
                res[this.#columns.find(([ , k ]) => key === k) ? this.#columns.find(([ , k ]) => key === k)[0] : `Unmapped_${key}`] = value;
            }

            yield res;
        }
    }

    get database()
    {
        return this.#database;
    }

    get table()
    {
        return this.#table;
    }

    static get Type()
    {
        return {
            ID: null,
            String: null,
        };
    }
}