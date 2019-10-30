import Adapter from './adapter.js';

export default class Json extends Adapter
{
    async from(data)
    {
        return JSON.parse(data);
    }

    async to(data)
    {
        return JSON.stringify(data);
    }
}