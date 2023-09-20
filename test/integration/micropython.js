'use strict';

const { shared, python } = require('./_shared.js');

module.exports = (playwright, baseURL) => {
    const { expect, test } = playwright;

    test('MicroPython bootstrap', python.bootstrap(playwright, baseURL));

    test('MicroPython fetch', python.fetch(playwright, `${baseURL}/fetch.html`));

    test('MicroPython to MicroPython Worker', shared.worker(playwright, `${baseURL}/worker.html`));

    test('MicroPython Worker window', shared.workerWindow(playwright, baseURL));

    test('MicroPython to Wasmoon Worker', shared.worker(playwright, `${baseURL}/worker-lua.html`));

    test('MicroPython Worker error', python.error(playwright, baseURL));

    test('MicroPython config as object', python.configAsObject(playwright, baseURL));

    test('MicroPython worker attribute', python.workerAttribute(playwright, `${baseURL}/worker-attribute.html`));

    test('MicroPython worker empty attribute', python.workerAttribute(playwright, `${baseURL}/worker-empty-attribute.html`));

    test('MicroPython worker tag', python.workerTagAttribute(playwright, `${baseURL}/worker-tag.html`));

    test('MicroPython worker bad', python.workerTagBadAttribute(playwright, `${baseURL}/worker-bad.html`));

    test('MicroPython w/out type', async ({ page }) => {
        await page.goto(`${baseURL}/no-type.html`);
        await page.waitForSelector('html.ready');
        const result = await page.evaluate(() => document.body.innerText);
        await expect(result.trim()).toBe('OK');
    });
};
