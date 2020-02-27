import Adapter from './adapter.js';

export default class Json extends Adapter
{
    async *from(data)
    {
        data = JSON.parse(data);

        if(Array.isArray(data))
        {
            for(const d of data)
            {
                yield* super.from(d);
            }

            return;
        }

        yield* super.from(data);
    }

    async to(data)
    {
        return super.to(JSON.stringify(data));
    }
}