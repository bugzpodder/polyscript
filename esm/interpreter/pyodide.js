import { fetchFiles, fetchJSModules, fetchPaths, writeFile } from './_utils.js';
import { registerJSModule, run, runAsync, runEvent } from './_python.js';
import { stdio } from './_io.js';

const type = 'pyodide';
const toJsOptions = { dict_converter: Object.fromEntries };

// REQUIRES INTEGRATION TEST
/* c8 ignore start */
export default {
    type,
    module: (version = '0.25.0') =>
        `https://cdn.jsdelivr.net/pyodide/v${version}/full/pyodide.mjs`,
    async engine({ loadPyodide }, config, url) {
        const { stderr, stdout, get } = stdio();
        const indexURL = url.slice(0, url.lastIndexOf('/'));
        const interpreter = await get(
            loadPyodide({ stderr, stdout, indexURL }),
        );
        if (config.files) await fetchFiles(this, interpreter, config.files);
        if (config.fetch) await fetchPaths(this, interpreter, config.fetch);
        if (config.js_modules) await fetchJSModules(config.js_modules);
        if (config.packages) {
            await interpreter.loadPackage('micropip');
            const micropip = await interpreter.pyimport('micropip');
            await micropip.install(config.packages, { keep_going: true });
            micropip.destroy();
        }
        return interpreter;
    },
    registerJSModule,
    run,
    runAsync,
    runEvent,
    transform: (interpreter, value) => (
        value instanceof interpreter.ffi.PyProxy ?
            value.toJs(toJsOptions) :
            value
    ),
    writeFile: ({ FS, PATH, _module: { PATH_FS } }, path, buffer) =>
        writeFile({ FS, PATH, PATH_FS }, path, buffer),
};
/* c8 ignore stop */
