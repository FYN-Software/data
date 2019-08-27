export default class Api
{
    constructor(schema)
    {
        this._schema = schema;
    }

    async read(args)
    {
        const base = this._schema.url;
        const options = {
            credentials: 'same-origin',
            headers: {
                'Authorization': `Bearer NzYxOTUxNTk3NjM2OuWMmFxYbQqzw9TTlceYFPWL3ddt`,
            },
        };

        return [ await fetch(`${base}${Object.values(args).join('/')}`, options).then(r => r.json()) ];
    }

    where(...args)
    {
        // console.log(args.map(a => a.match(/`([a-zA-Z_]+)`\s*.\s*@([a-zA-Z_]+)/).slice(1, 3)));
    }

    order(...args)
    {
        // console.log(args);
    }
}