import { Blockchain, SandboxContract, TreasuryContract} from '@ton-community/sandbox';
import { compile, NetworkProvider } from '@ton-community/blueprint';
import { JettonMinter } from '../wrappers/JettonMinter';
import { Address, beginCell, Cell, toNano} from 'ton-core';
import '@ton-community/test-utils';

import { JettonWallet } from '../wrappers/JettonWallet';

describe('JettonWallet', () => {
////////////////////////    WRITE INITIAL VALUE FOR ALL BLOCKS TEST   ///////////////////////////////
    let code: Cell;
    let blockchain: Blockchain;
    let admin: SandboxContract<TreasuryContract>;
    let jettonMinter: SandboxContract<JettonMinter>;


    let jettonWallet_sender: SandboxContract<JettonWallet>;
    let jettonWallet_receiver: SandboxContract<JettonWallet>;

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
    //////////////////////////////////////////////////////////////////////////////////////////////////

        /////////////////////    DEPLOY SENDER'S WALLET     ///////////////////////////
        jettonWallet_sender = blockchain.openContract(JettonWallet.createFromConfig({
            ownerAddress: admin.address,
            minterAddress: admin.getSender().address,
            walletCode: code,
            balance: 1000n //BigInt(await jettonMinter.getTotalsupply())
        }, code));
        const deployResult_wallet_sender = await jettonWallet_sender.sendDeploy(admin.getSender(), toNano('200'));

        expect(deployResult_wallet_sender.transactions).toHaveTransaction({
            from: admin.address,
            to: jettonWallet_sender.address,
            deploy: true,
            success: true,
        });
        // /////////////////////    DEPLOY RECEIVER'S WALLET     ///////////////////////////
        // jettonWallet_receiver = blockchain.openContract(JettonWallet.createFromConfig({
        //     ownerAddress: user.address,
        //     minterAddress: user.getSender().address,
        //     walletCode: code,
        //     balance: 0n
        // }, code));
        // const deployResult_wallet_receiver = await jettonWallet_receiver.sendDeploy(user.getSender(), toNano('200'));

        // expect(deployResult_wallet_receiver.transactions).toHaveTransaction({
        //     from: user.address,
        //     to: jettonWallet_receiver.address,
        //     deploy: true,
        //     success: true,
        // });

        // ///////////////////////////////////////////////////////////////////////////////// 
        

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
    it('update balance', async () => {
        // update admin's balance

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

    // it('should return token balance', async () => {
    //     console.log("Balance of sender's wallet:  ",await jettonWallet_sender.getBalance());
    // });  
});
