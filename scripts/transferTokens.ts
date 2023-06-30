import { Address, toNano } from 'ton-core';
import { JettonWallet } from '../wrappers/JettonWallet';
import { compile, NetworkProvider, sleep } from '@ton-community/blueprint';
import { randomAddress } from '@ton-community/test-utils';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

//     const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Minter address'));
//     // const address = Address.parse(args.length > 0 ? args[0] : await ui.input('JettonWallet address'));


////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let code = await compile('JettonWallet');    
    const jettonWallet = provider.open(JettonWallet.createFromConfig({
        ownerAddress: Address.parse("EQBk2RnATouZMDllbUVZPfg-FKw-9jY9naY6NDYc36H5D4Fi"),//provider.sender().address as Address, 
        minterAddress: Address.parse("EQA7NAkEZVxWb2GUpcmGr5VphjhciBwnYGz7kOayKCP4rILx"),
        walletCode: code,
        // balance: toNano(1520n) //BigInt(await jettonMinter.getTotalsupply())
    }, code));

////////////////////////////////////////////////////////////////////////////////////////////////////////

    const jettonWallet_re = provider.open(JettonWallet.createFromConfig({
        ownerAddress: Address.parse("EQD4-czwqbMTsC1EETqbVtay0ruY4lAtDvq2ec7QsbcxeNIg"),//provider.sender().address as Address, 
        minterAddress: Address.parse("EQA7NAkEZVxWb2GUpcmGr5VphjhciBwnYGz7kOayKCP4rILx"),
        walletCode: code,
        // balance: toNano(1520n) //BigInt(await jettonMinter.getTotalsupply())
    }, code));
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        await jettonWallet.sendTransfer(provider.sender(), {
            value: toNano('0.2'),
            fwdAmount: toNano('0.05'),
            jettonAmount: toNano('19'),
            toAddress: Address.parse("EQD4-czwqbMTsC1EETqbVtay0ruY4lAtDvq2ec7QsbcxeNIg"),
            queryId: Date.now()
        });
// ////////////////////////     /SHOW BALANCE   /////////////////////////////////////////////
    ui.write('Balance!');
    ui.write((await jettonWallet.getBalance()).toString());
    ui.write('Transfered successfully!');
    ui.write((await jettonWallet_re.getBalance()).toString());
    ui.write('Transfered successfully!');
}