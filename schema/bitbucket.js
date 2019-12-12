import Schema from './schema.js';
import { Order } from '../query/query.js';

export default class Bitbucket extends Schema
{
    #path;
    #map;

    constructor(path, map)
    {
        super();

        this.#path = path;
        this.#map = map;
    }

    prepare(query, args)
    {
        const parts = new Map();

        for (const [method, args] of query)
        {
            switch (method)
            {
                case 'where':
                    parts.set('q', args.map(a => `${a.name}${a.operator}${a.value}`).join(' AND '));
                    break;

                case 'order':
                    parts.set('sort', `${args[1] === Order.asc ? '' : '-'}${args[0].name}`);
                    break;

                case 'select':
                    parts.set('fields', args.map(a => a.name).join(','));
                    break;

                case 'limit':
                    parts.set('limit', args[0]);
                    break;
            }
        }

        return `${this.#path}/${args.id}?${Array.from(parts, ([ method, args ]) => `${method}=${args}`).join('&')}`;
    }

    async *map(data)
    {
        for await (const item of data)
        {
            for(const [ base, field ] of Object.entries(this.#map))
            {
                const value = item[base];
                delete item[base];
                item[field] = value;
            }

            yield item;
        }
    }
}