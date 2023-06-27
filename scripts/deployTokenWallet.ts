import { Address, beginCell, toNano } from 'ton-core';
import { Token } from '../wrappers/Token';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {

    // const randomSeed = Math.floor(Math.random() * 10000);
    const randomSeed = 7495 * 10 ** 14;

    const token = provider.open(Token.createFromConfig({

        adminAddress: provider.sender().address as Address,
        content: beginCell().storeUint(randomSeed, 256).endCell(),
        jettonWalletCode: await compile('Token')

    }, await compile('Token')));

    await token.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(token.address);
    /////////////////////////////////////////////////////////////////////

    await token.sendMint(provider.sender(), {
        value: toNano('0.2'),
        amount: toNano('0.01'),
        jettonAmount: toNano('250'),
        toAddress: provider.sender().address as Address,
    });

    console.log("address: ", provider.sender().address as Address);

    await provider.waitForDeploy(token.address);
    ///////////////////////////////////////////////////////////////////////////

    // // console.log("TotalSupply: ", await Token.getsupply());
    // console.log("TotalSupply: ", await token.getsupply());

    // run methods on Token
}