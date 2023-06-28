import { Address, toNano } from 'ton-core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { NetworkProvider, sleep } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Minter address'));

    const jettonMinter = provider.open(JettonMinter.createFromAddress(address));
    // await jettonMinter.sendDeploy(provider.sender(), toNano('0.05'));

    // await provider.waitForDeploy(jettonMinter.address);

        await jettonMinter.sendMint(provider.sender(), {
            value: toNano('0.2'),
            amount: toNano('0.01'),
            jettonAmount: toNano('125'),
            toAddress: provider.sender().address as Address,
            queryId: Date.now()
        });
        
    // await provider.waitForDeploy(jettonMinter.address);

    // console.log("TotalSupply", await jettonMinter.getsupply());
    ui.write('Minted successfully!');
}