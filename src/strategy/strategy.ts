

export default abstract class Strategy<T extends IModel<T>> implements IStrategy<T>
{
    public owner: IModel<T> | undefined;

    public async *fetch(query: IQuery<T>, args: object): AsyncGenerator<object, void, void>
    {
    }

}