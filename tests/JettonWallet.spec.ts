import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { JettonWallet } from '../wrappers/JettonWallet';
import '@ton-community/test-utils';
import { Address, beginCell } from 'ton-core';
import { compile, NetworkProvider } from '@ton-community/blueprint';
import { JettonMinter } from '../wrappers/JettonMinter';

import * as fs from 'fs';

describe('JettonWallet', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('JettonWallet');
    });

    let blockchain: Blockchain;
    let jettonWallet: SandboxContract<JettonWallet>;

    const minterAddressHash = fs.readFileSync('jettonMinterAddress.txt', 'utf-8').trim();

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        const deployer = await blockchain.treasury('deployer');

        jettonWallet = blockchain.openContract(JettonWallet.createFromConfig({
            ownerAddress: deployer.getSender().address,
            minterAddress: new Address(0, Buffer.from(minterAddressHash, 'hex')),
            walletCode: await compile('JettonWallet')
        }, code));

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
        // print all variables
        console.log('JettonWallet address:', jettonWallet.address);
    });


    it('should check balance', async () => {
        const deployer = await blockchain.treasury('deployer');
        const recipient = await blockchain.treasury('recipient');

        // check balance
        const balance = await jettonWallet.get_wallet_data();
        console.log('balance:', balance);

    });
});