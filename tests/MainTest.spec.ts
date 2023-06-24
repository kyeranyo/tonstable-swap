import { Blockchain, SandboxContract, TreasuryContract} from '@ton-community/sandbox';
import { compile, NetworkProvider } from '@ton-community/blueprint';
import { JettonMinter } from '../wrappers/JettonMinter';
import { Address, beginCell, Cell, toNano} from 'ton-core';
import '@ton-community/test-utils';

import { JettonWallet } from '../wrappers/JettonWallet';

describe('JettonMinter', () => {
////////////////////////    WRITE INITIAL VALUE FOR ALL BLOCKS TEST   ///////////////////////////////
    let code: Cell;
    let blockchain: Blockchain;
    let admin: SandboxContract<TreasuryContract>;
    let jettonMinter: SandboxContract<JettonMinter>;

    beforeAll(async () => {
        code = await compile('JettonMinter');
        blockchain = await Blockchain.create();
        // admin = await blockchain.treasury('admin');
        admin = await blockchain.treasury('admin');
    // });
    // beforeEach(async () => {

        jettonMinter = blockchain.openContract(JettonMinter.createFromConfig({
            adminAddress: admin.getSender().address,
            content: beginCell().storeUint(0, 256).endCell(),
            jettonWalletCode: await compile('JettonWallet')
        }, code));

        const deployResult = await jettonMinter.sendDeploy(admin.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: admin.address,
            to: jettonMinter.address,
            deploy: true,
            success: true,
        });
    });
////////////////////////    WRITE BLOCK TEST     ///////////////////////////////
    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and jettonMinter are ready to use
        console.log('JettonMinter address:', jettonMinter.address);
    });

    it('should mint tokens', async () => {
        const recipient = await blockchain.treasury('recipient');
        // mint some tokens for the admin
        const mintAmount = toNano('1000');
        const mintResult = await jettonMinter.sendMint(admin.getSender(), {
            value: toNano('0.2'),
            amount: toNano('0.05'),
            jettonAmount: toNano('455'),
            toAddress: admin.getSender().address as Address,
            queryId: Date.now()
        });
    });

    it('should return token balance', async () => {
        // check admin's balance
        const balance = await jettonMinter.getTotalsupply();
        console.log('balance', balance);
    });

    it('transfer balance', async () => {
        // check admin's balance

        const balance = await jettonMinter.getTotalsupply();
        console.log('balance', balance);
    });

});
