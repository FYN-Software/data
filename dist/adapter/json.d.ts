import Adapter from './adapter';
export default class Json extends Adapter {
    private static reader;
    from(data: AsyncGenerator<string, void, void>): AsyncGenerator<any, void, void>;
    to(data: AsyncGenerator<any, void, void>): AsyncGenerator<any, void, void>;
}
//# sourceMappingURL=json.d.ts.map