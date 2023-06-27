import { Address, toNano } from 'ton-core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { JettonWallet } from '../wrappers/JettonWallet';
import { NetworkProvider, sleep } from '@ton-community/blueprint';



export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    // const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Minter address'));
    const address = Address.parse("EQA7NAkEZVxWb2GUpcmGr5VphjhciBwnYGz7kOayKCP4rILx");
    const jettonMinter = provider.open(JettonMinter.createFromAddress(address));
    
    // const address_wallet = Address.parse(args.length > 0 ? args[0] : await ui.input('JettonWallet address'));

    // const jettonWallet = provider.open(JettonWallet.createFromAddress(address_wallet));



    const supply = await jettonMinter.getTotalsupply();
    console.log("Totalsupply", supply);
    

    // const balance = await jettonWallet.getBalance();
    // console.log("Totalbalance", balance);

    ui.write('Showed balance successfully!');
}