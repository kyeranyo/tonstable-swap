import { Address, toNano } from 'ton-core';
import { JettonWallet } from '../wrappers/JettonWallet';
import { compile, NetworkProvider, sleep } from '@ton-community/blueprint';
import { randomAddress } from '@ton-community/test-utils';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

////////////////////////////////////////////////////////////////////////////////////////////////////////////

//     const owneraddress = Address.parse(args.length > 0 ? args[0] : await ui.input('JettonWallet address'));

////////if you want change to other Token to transfer, you change minter address who create that Token 
//     const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Minter address'));


////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let code = await compile('JettonWallet');    
    const jettonWallet = provider.open(JettonWallet.createFromConfig({
        ownerAddress: Address.parse("EQBk2RnATouZMDllbUVZPfg-FKw-9jY9naY6NDYc36H5D4Fi"),//provider.sender().address as Address, 
        minterAddress: Address.parse("EQA7NAkEZVxWb2GUpcmGr5VphjhciBwnYGz7kOayKCP4rILx"),
        walletCode: code,
    }, code));

////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    await jettonWallet.sendBurn(provider.sender(), {
        value: toNano('0.2'),
        jettonAmount: toNano('50'),
        queryId: Date.now()
    });

////////////////////////////////////////////////////////////////////////////////////////////////////////

    ui.write('Burned successfully!');
}