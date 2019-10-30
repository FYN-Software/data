import { clone } from '../component/extends.js';

const closures = [
    [ 'select', [] ],
    [ 'from', [] ],
    [ 'where', [] ],
];

export default class Database
{
    #schema;
    #connection;
    #closures;

    constructor(schema)
    {
        this.#schema = schema;
        this.#closures = [
            {
                type: 'from',
                get value()
                {
                    const db = schema.database;
                    const table = schema.table;

                    return `\`${db}\`.\`${table}\``;
                },
            }
        ];
    }

    async read(args)
    {
        return this.#connection.query(this.sql, JSON.stringify(args));
    }

    where(...args)
    {
        this.#closures.push(...args.map(a => ({ type: 'where', value: a })))
    }

    get sql()
    {
        let parts = this.#closures
            .reduce(
                (t, c) => {
                    t.has(c.type)
                        ? t.get(c.type).push(c.value)
                        : t.set(c.type, [ c.value ]);

                    return t;
                },
                new Map(clone(closures))
            );

        if(parts.get('select').length === 0)
        {
            parts.get('select').push(['*'])
        }

        parts = Array.from(parts.entries()).filter(p => p[1].length > 0);

        // TODO(Chris Kruining)
        //  `p[1]` is now simply joined.
        //  however each type should
        //  declare its own joining style
        return parts.map(p => `${ p[0].toUpperCase() } ${ p[1].join(', ') }`).join(' ');
    }
}