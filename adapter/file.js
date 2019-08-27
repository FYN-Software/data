import Meta from "../../api/meta.js";
import Sftp from "../../api/sftp.js";

export default class File
{
    constructor(files, schema)
    {
        // this._files = files;
        // this._schema = schema;
        //
        // this.__loaded_cb = null;
        // this.__loaded = new Promise(r => this.__loaded_cb = r);
        //
        // this._sftp = new Sftp();
        // const m = new Meta();
        //
        // Promise.all([
        //     m.getDebugServerIP().then(),
        //     m.getDebugServerFingerprint().then(),
        // ])
        //     .then(([ip, fingerprint]) => this._sftp.openSession('/tmp/', ip, 'root', fingerprint))
        //     .then(r => {
        //         if(r === false)
        //         {
        //             throw new Error('failed to open sftp connection');
        //         }
        //
        //         this.__loaded_cb();
        //     });
    }

    async read(limit = null)
    {
        // const keys = Object.entries(this._files);
        //
        // return this.__loaded.then(() => this._sftp.retrieveContentOfFiles(Object.values(this._files)).then(r => {
        //     const o = {};
        //
        //     for(let k in r)
        //     {
        //         o[keys.find(([,f]) => f == k)[0]] = this._schema.interpretate(r[k], limit);
        //     }
        //
        //     return this._schema.aggregate(o);
        // }));

        return [];
    }
}