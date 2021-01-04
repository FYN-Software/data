import Adapter from './adapter.js';

export default class Json extends Adapter
{
    static async *#reader(data)
    {
        for await (let value of data)
        {
            try
            {
                value = JSON.parse(value);

                if(Array.isArray(value))
                {
                    yield* value
                }
                else
                {
                    yield value;
                }
            }
            catch (e)
            {
                console.error(e);
            }
        }
    };

    async *from(data)
    {
        yield* super.from(Json.#reader(data));
    }

    async to(data)
    {
        return super.to(JSON.stringify(data));
    }
}