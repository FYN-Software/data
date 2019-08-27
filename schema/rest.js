import Enum from '../../../node_modules/@fyn-software/data/type/enum.js';

const endpoints = Enum.define({
    Bitbucket: 'https://toolkit.fyn.nl/bitbucket/{{ project }}/repos/{{ repository }}/{{ table }}/',
});

export default class Rest
{
    constructor(endpoint = endpoints.Bitbucket, project, repository, table)
    {
        this.endpoint = endpoint;
        this.project = project;
        this.repository = repository;
        this.table = table;
    }

    get url()
    {
        return endpoints.valueOf(this.endpoint).replace(/{{\s*([a-zA-Z]+)\s*}}/g, (w, m) => this[m]);
    }

    static get Endpoints()
    {
        return endpoints;
    }
}