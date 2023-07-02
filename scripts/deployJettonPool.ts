import { toNano } from 'ton-core';
import { JettonPool } from '../wrappers/JettonPool';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const jettonPool = provider.open(JettonPool.createFromConfig({}, await compile('JettonPool')));

    await jettonPool.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(jettonPool.address);

    // run methods on `jettonPool`
}
