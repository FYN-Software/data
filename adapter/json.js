import Adapter from './adapter.js';

export default class Json extends Adapter
{
    async *from(data)
    {
        for await (let value of data)
        {
            try
            {
                value = JSON.parse(value);

                if(Array.isArray(value))
                {
                    for(const d of value)
                    {
                        yield* super.from(d);
                    }

                    return;
                }

                yield* super.from(value);
            }
            catch (e)
            {
                console.error(e);
            }
        }
    }

    async to(data)
    {
        return super.to(JSON.stringify(data));
    }
}