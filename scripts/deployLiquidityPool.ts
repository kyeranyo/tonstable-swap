import { toNano } from 'ton-core';
import { LiquidityPool } from '../wrappers/LiquidityPool';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const liquidityPool = provider.open(LiquidityPool.createFromConfig({}, await compile('LiquidityPool')));

    await liquidityPool.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(liquidityPool.address);

    // run methods on `liquidityPool`
}
