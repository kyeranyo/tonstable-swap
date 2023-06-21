// import { toNano } from 'ton-core';

// import { compile, NetworkProvider } from '@ton-community/blueprint';
import { JettonWallet } from '../wrappers/JettonWallet';
import { Address, beginCell, toNano } from 'ton-core';
import { compile, NetworkProvider } from '@ton-communi ty/blueprint';

import fs = require('fs');



export async function run(provider: NetworkProvider) {
    const wallet = provider.open(JettonWallet.createFromConfig({
        ownerAddress: provider.sender().address as Address,
        minterAddress: provider.sender().address as Address,
        walletCode: await compile('JettonWallet')
    }, await compile('JettonWallet')));

    await wallet.sendDeploy(provider.sender(), toNano('0.05'));


    await provider.waitForDeploy(wallet.address);

    fs.writeFileSync('jettonWalletAddress.txt', wallet.address.toString());

    // run methods on `wallet`
}
