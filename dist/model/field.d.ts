import Type from '../type/type';
export default class Field<T extends Type> {
    private readonly _name;
    private readonly _type;
    private _operator;
    private _value;
    constructor(name: string, type: Constructor<T>);
    [Symbol.toPrimitive](hint: string): string | Field<T>;
    isEqualTo(value: any): Field<T>;
    isNotEqualTo(value: any): Field<T>;
    isGreaterThan(value: any): Field<T>;
    isGreaterThanOrEqualTo(value: any): Field<T>;
    isLessThan(value: any): Field<T>;
    isLessThanOrEqualTo(value: any): Field<T>;
    get asc(): Field<T>;
    get desc(): Field<T>;
    get name(): string;
    get type(): Constructor<T>;
    get operator(): string;
    get value(): any;
}
//# sourceMappingURL=field.d.ts.map