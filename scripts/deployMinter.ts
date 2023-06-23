import { Address, beginCell, toNano } from 'ton-core';
import { Minter } from '../wrappers/Minter';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const minter = provider.open(Minter.createFromConfig({
        adminAddress: provider.sender().address as Address,
        jettonWalletCode: await compile('Minter')
    }, await compile('Minter')));

    await minter.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(minter.address);

    // run methods on `minter`
}
