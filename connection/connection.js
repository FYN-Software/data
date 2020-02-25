export default class Connection
{
    #source;

    get source()
    {
        return this.#source;
    }

    set source(s)
    {
        this.#source = s;
    }

    async *fetch(query)
    {
    }
}