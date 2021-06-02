import IConnection from './iConnection';
import ISource from '../source/iSource';
export default abstract class Connection implements IConnection {
    private _source;
    get source(): ISource<any> | undefined;
    set source(s: ISource<any> | undefined);
    protected constructor();
    fetch(query: any, args?: object): AsyncGenerator<any, void, void>;
    static get default(): typeof Connection;
}
//# sourceMappingURL=connection.d.ts.map