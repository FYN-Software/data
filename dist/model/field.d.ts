declare type Operator = 'ASC' | 'DESC' | '=' | '!=' | '>' | '>=' | '<' | '<=';
export default class Field<T> {
    private readonly _name;
    private _operator;
    private _value;
    constructor(name: string);
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
    get operator(): Operator | undefined;
    get value(): any;
}
export {};
//# sourceMappingURL=field.d.ts.map