import { toNano } from 'ton-core';
import { Store } from '../wrappers/Store';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const store = provider.open(Store.createFromConfig({}, await compile('Store')));

    await store.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(store.address);

    // run methods on `store`
}
