import { Address, toNano } from 'ton-core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { NetworkProvider, sleep } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Minter address'));
    const jettonMinter = provider.open(JettonMinter.createFromAddress(address));
    
    ui.write('Balance: ');
    const balance = await jettonMinter.getTotalsupply();
    ui.write(balance.toString());
    ui.write('Showed balance successfully!');
}