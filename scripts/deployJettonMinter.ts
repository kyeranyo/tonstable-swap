import { Address, beginCell, toNano } from 'ton-core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { compile, NetworkProvider } from '@ton-community/blueprint';
import { JettonWallet } from '../wrappers/JettonWallet';
import { randomAddress } from '@ton-community/test-utils';

export async function run(provider: NetworkProvider,  args: string[]) {

    // const randomSeed = Math.floor(Math.random() * 10000);
    const randomSeed = 7495 * 10**14;

    const jettonMinter = provider.open(JettonMinter.createFromConfig({
        
        adminAddress: provider.sender().address as Address,
        content: beginCell().storeUint(randomSeed, 256).endCell(),
        jettonWalletCode: await compile('JettonWallet')

    }, await compile('JettonMinter')));

    await jettonMinter.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(jettonMinter.address);
    /////////////////////////////////////////////////////////////////////

    await jettonMinter.sendMint(provider.sender(), {
        value: toNano('0.2'),
        amount: toNano('0.01'),
        jettonAmount: toNano('10'),
        toAddress: provider.sender().address as Address,
        queryId: Date.now()
    });

    await provider.waitForDeploy(jettonMinter.address);
    ///////////////////////////////////////////////////////////////////////////
    // const ui = provider.ui();

    // // const address = Address.parse(args.length > 0 ? args[0] : await ui.input('JettonWallet address'));
    // const address =  Address.parse("EQBk2RnATouZMDllbUVZPfg-FKw-9jY9naY6NDYc36H5D4Fi");

    // const re_address =  Address.parse("EQD4-czwqbMTsC1EETqbVtay0ruY4lAtDvq2ec7QsbcxeNIg");

    // const jettonWallet = provider.open(JettonWallet.createFromAddress(address));
    // await jettonWallet.sendDeploy(provider.sender(), toNano('0.05'));

    // await jettonWallet.sendTransfer(provider.sender(), {
    //     value: toNano('0.2'),
    //     fwdAmount: toNano('0.05'),
    //     jettonAmount: toNano('20'),
    //     toAddress: re_address,
    //     queryId: Date.now()
    // });

    // await provider.waitForDeploy(jettonWallet.address);
// console.log();
// ui.write('Transfered successfully!');

////////////////////////////////////////////////////////////////////////////
    // console.log("Balance: ", await jettonWallet.getBalance());
    console.log("TotalSupply: ", await jettonMinter.getsupply());

    // run methods on `jettonMinter`
}
