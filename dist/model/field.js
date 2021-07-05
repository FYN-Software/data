export default class Field {
    constructor(name) {
        this._name = name;
    }
    [Symbol.toPrimitive](hint) {
        if (hint === 'string') {
            return [`$${this._name}`, this._operator, this._value].join(' ');
        }
        return this;
    }
    isEqualTo(value) {
        this._operator = '=';
        this._value = value;
        return this;
    }
    isNotEqualTo(value) {
        this._operator = '!=';
        this._value = value;
        return this;
    }
    isGreaterThan(value) {
        this._operator = '>';
        this._value = value;
        return this;
    }
    isGreaterThanOrEqualTo(value) {
        this._operator = '>=';
        this._value = value;
        return this;
    }
    isLessThan(value) {
        this._operator = '<';
        this._value = value;
        return this;
    }
    isLessThanOrEqualTo(value) {
        this._operator = '<=';
        this._value = value;
        return this;
    }
    get asc() {
        this._operator = 'ASC';
        return this;
    }
    get desc() {
        this._operator = 'DESC';
        return this;
    }
    get name() {
        return this._name;
    }
    get operator() {
        return this._operator;
    }
    get value() {
        return this._value;
    }
}
