export default abstract class Strategy<T extends IModel<T>> implements IStrategy<T> {
    owner: IModel<T> | undefined;
    fetch(query: IQuery<T>, args: object): AsyncGenerator<object, void, void>;
}
//# sourceMappingURL=strategy.d.ts.map