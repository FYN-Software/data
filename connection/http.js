import Connection from './connection.js';

export default class Http extends Connection
{
    #url;
    #options = { credentials: 'same-origin' };

    constructor(url, options)
    {
        super();

        this.#url = url;
        this.#options = { ...this.#options, ...options };
    }

    async *fetch(query, args)
    {
        const url = `${this.#url}${query?.url ?? ''}`;
        const options = { ...this.#options, ...query.options };

        const response  = await fetch(url, options);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try
        {
            while(true)
            {
                const { done, value } = await reader.read();

                if(done)
                {
                    break;
                }

                yield decoder.decode(value, {stream: true});
            }
        }
        finally
        {
            reader.releaseLock();
        }
    }
}