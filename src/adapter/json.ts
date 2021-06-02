import Adapter from './adapter';

export default class Json extends Adapter
{
    private static async *reader(data: AsyncGenerator<string, void, void>): AsyncGenerator<any, void, void>
    {
        for await (let value of data)
        {
            try
            {
                value = JSON.parse(value);

                if(Array.isArray(value))
                {
                    for(const item of value)
                    {
                        yield item;
                    }
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
    }

    public async *from(data: AsyncGenerator<string, void, void>): AsyncGenerator<any, void, void>
    {
        yield* super.from(Json.reader(data));
    }

    public async *to(data: AsyncGenerator<any, void, void>): AsyncGenerator<any, void, void>
    {
        yield* super.to(JSON.stringify(data).toAsyncIterable());
    }
}
