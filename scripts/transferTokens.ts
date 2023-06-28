import { Address, toNano } from 'ton-core';
import { JettonWallet } from '../wrappers/JettonWallet';
import { compile, NetworkProvider, sleep } from '@ton-community/blueprint';
import { randomAddress } from '@ton-community/test-utils';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    // const address_minter = Address.parse(args.length > 0 ? args[0] : await ui.input('Minter address'));
    // const address = Address.parse(args.length > 0 ? args[0] : await ui.input('JettonWallet address'));


////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let code = await compile('JettonWallet');    
    const jettonWallet = provider.open(JettonWallet.createFromConfig({
        ownerAddress: provider.sender().address as Address,
        minterAddress: Address.parse("EQA7NAkEZVxWb2GUpcmGr5VphjhciBwnYGz7kOayKCP4rILx"),
        walletCode: code,
        balance: toNano(1520n) //BigInt(await jettonMinter.getTotalsupply())
    }, code));
    const wallet_sender = await jettonWallet.sendDeploy(provider.sender(), toNano('0.05'));

// wallet for rec
    // const jettonWallet_receiver = provider.open(JettonWallet.createFromConfig({
    //     ownerAddress: provider.sender().address as Address,
    //     minterAddress: Address.parse("EQA7NAkEZVxWb2GUpcmGr5VphjhciBwnYGz7kOayKCP4rILx"),
    //     walletCode: code,
    //     balance: toNano(1495n) //BigInt(await jettonMinter.getTotalsupply())
    // }, code));
    // const wallet_receiver = await jettonWallet.sendDeploy(provider.sender(), toNano('0.05'));



    // console.log(jettonWallet.getBalance());
////////////////////////////////////////////////////////////////////////////////////////////////////////
    // await jettonWallet.sendBurn(provider.sender(), {
    //     value: toNano('0.02'),
    //     jettonAmount: toNano('50'),
    //     queryId: Date.now()
    // });


    // const address = Address.parse(args.length > 0 ? args[0] : await ui.input('JettonWallet address'));
    // const jettonWallet = 
    // provider.open(JettonWallet.createFromAddress(Address.parse("EQA7NAkEZVxWb2GUpcmGr5VphjhciBwnYGz7kOayKCP4rILx")));  //JettonWallet.createFromAddress(address)
    // const wallet_sender = await jettonWallet.sendDeploy(provider.sender(), toNano('0.05'));


        await jettonWallet.sendTransfer(provider.sender(), {
            value: toNano('0.2'),
            fwdAmount: toNano('0.05'),
            jettonAmount: toNano('11'),
            toAddress: randomAddress(),//Address.parse("EQD4-czwqbMTsC1EETqbVtay0ruY4lAtDvq2ec7QsbcxeNIg"),
            queryId: Date.now()
        });
    
    ui.write('Transfered successfully!');
}