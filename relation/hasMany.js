export default class HasMany
{
    static get many()
    {
        return true;
    }

    targets(t)
    {
        this._target = t;

        return this;
    }

    static targets(t)
    {
        return (new this).targets(t);
    }
}