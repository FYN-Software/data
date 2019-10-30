export default class Adapter
{
    static get default()
    {
        return class extends this
        {
            async from(data)
            {
                return data;
            }

            async to(data)
            {
                return data;
            }
        }
    }
}