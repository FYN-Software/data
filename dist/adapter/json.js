import Adapter from './adapter';
export default class Json extends Adapter {
    static async *reader(data) {
        for await (let value of data) {
            try {
                value = JSON.parse(value);
                if (Array.isArray(value)) {
                    for (const item of value) {
                        yield item;
                    }
                }
                else {
                    yield value;
                }
            }
            catch (e) {
                console.error(e);
            }
        }
    }
    async *from(data) {
        yield* super.from(Json.reader(data));
    }
    async *to(data) {
        yield* super.to(JSON.stringify(data).toAsyncIterable());
    }
}
