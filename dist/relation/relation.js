export default class Relation {
    static get many() {
        return true;
    }
    static ownedBy(owner) {
        return this;
    }
    static targets(target) {
        return this;
    }
    static maps(conf) {
        return this;
    }
}
