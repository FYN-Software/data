export default class HasMany
{
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