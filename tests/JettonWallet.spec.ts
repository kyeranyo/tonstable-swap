import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano, Address } from 'ton-core';
import { JettonWallet } from '../wrappers/JettonWallet';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';




import BN from "bn.js";
import { KeyPair, mnemonicNew, mnemonicToPrivateKey } from 'ton-crypto';
// import { Cell, beginCell, Address } from "ton";

// // encode contract storage according to save_data() contract method
// export function data(params: { address1: Address; address2: Address }): Cell {
//   return beginCell().storeAddress(params.address1).storeAddress(params.address2).endCell();
// }

async function ramdomkp() : Promise<KeyPair> {
    let mnemonics = await mnemonicNew();
    return mnemonicToPrivateKey(mnemonics);
}

describe('JettonWallet', () => {
    let code: Cell;
    let owner: SandboxContract<JettonWallet>;

    beforeAll(async () => {
        code = await compile('JettonWallet');
    });

    let blockchain: Blockchain;
    let jettonWallet: SandboxContract<JettonWallet>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        jettonWallet = blockchain.openContract(JettonWallet.createFromConfig({
            ownerAddress: jettonWallet.address,
            minterAddress: jettonWallet.address,
            walletCode: 
        }, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await jettonWallet.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonWallet.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and jettonWallet are ready to use
    });
});




