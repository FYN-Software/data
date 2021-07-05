export default abstract class Schema implements ISchema {
    private _source;
    get source(): ISource<any> | undefined;
    set source(s: ISource<any> | undefined);
    protected constructor();
    prepare<T extends IModel<T>>(query: IQuery<T>, args?: object): Promise<any>;
    map(data: AsyncGenerator<any, void, void>): AsyncGenerator<any, void, void>;
    static get default(): typeof Schema;
}
//# sourceMappingURL=schema.d.ts.map