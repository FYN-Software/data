import Adapter from './adapter.js';

export default class Json extends Adapter
{
    async *from(data)
    {
        yield* super.from(JSON.parse(data));
    }

    async to(data)
    {
        return super.to(JSON.stringify(data));
    }
}