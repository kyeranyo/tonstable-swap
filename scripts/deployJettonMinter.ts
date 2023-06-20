import { Address, beginCell, toNano } from 'ton-core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { compile, NetworkProvider } from '@ton-community/blueprint';

import fs = require('fs');

export async function run(provider: NetworkProvider) {

    const randomSeed = Math.floor(Math.random() * 10000); // random seed for the contract 

    const jettonMinter = provider.open(JettonMinter.createFromConfig({
        adminAddress: provider.sender().address as Address, // adress of the deployer`
        content: beginCell().storeUint(randomSeed, 256).endCell(), // beginCell = mơ đơn vị cell, 
        jettonWalletCode: await compile('JettonWallet')

    }, await compile('JettonMinter')));

    await jettonMinter.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(jettonMinter.address);

    fs.writeFileSync('jettonMinterAddress.txt', jettonMinter.address.toString());


    // to nano = x * 10^9

    // run methods on `jettonMinter`
}
