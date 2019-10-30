export default class Api
{
    #schema;

    constructor(schema)
    {
        this.#schema = schema;
    }

    async read(args)
    {
        const base = this.#schema.url;
        const options = {
            credentials: 'same-origin',
            headers: {
                'Authorization': `Bearer NzYxOTUxNTk3NjM2OuWMmFxYbQqzw9TTlceYFPWL3ddt`,
            },
        };

        return [ await fetch(`${base}${Object.values(args).join('/')}`, options).then(r => r.json()) ];
    }
}