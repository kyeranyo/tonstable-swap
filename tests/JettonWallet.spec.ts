import { Blockchain, SandboxContract, TreasuryContract} from '@ton-community/sandbox';
import { Cell, toNano, Address, beginCell} from 'ton-core';
import { JettonWallet } from '../wrappers/JettonWallet';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { JettonMinter } from '../wrappers/JettonMinter';


describe('JettonWallet', () => {
    let code: Cell;
    let blockchain: Blockchain;
    let jettonWallet: SandboxContract<JettonWallet>;

    let admin: SandboxContract<TreasuryContract>;
    let jettonMinter: SandboxContract<JettonMinter>;
    

    let user: SandboxContract<TreasuryContract>;
    let receiver: SandboxContract<JettonMinter>;

    beforeAll(async () => {
        code = await compile('JettonWallet');
    // });
    // beforeEach(async () => {
        blockchain = await Blockchain.create();
        admin = await blockchain.treasury('admin'); 
        user = await blockchain.treasury('user'); 
        /////////////////////    DEPLOY SENDER'S WALLET     ///////////////////////////
        jettonWallet = blockchain.openContract(JettonWallet.createFromConfig({
            ownerAddress: admin.address,
            minterAddress: admin.getSender().address,
            walletCode: code 
        }, code));
        const deployResult = await jettonWallet.sendDeploy(admin.getSender(), toNano('200'));

        expect(deployResult.transactions).toHaveTransaction({
            from: admin.address,
            to: jettonWallet.address,
            deploy: true,
            success: true,
        });
        ////////////////////DEPLOY SENDER AND RECEIVER/////////////////////

        jettonMinter = blockchain.openContract(JettonMinter.createFromConfig({
            adminAddress: admin.getSender().address,
            content: beginCell().storeUint(0, 256).endCell(),
            jettonWalletCode: code
        }, code ));
        await jettonMinter.sendDeploy(admin.getSender(), toNano('0.05'));

        receiver = blockchain.openContract(JettonMinter.createFromConfig({
            adminAddress: user.getSender().address,
            content: beginCell().storeUint(0, 256).endCell(),
            jettonWalletCode: await compile('JettonWallet')
        }, code ));
        await receiver.sendDeploy(user.getSender(), toNano('0.05'));


        // jettonWallet = blockchain.openContract(JettonWallet.createFromConfig({
        //     ownerAddress: admin.address,
        //     minterAddress: jettonMinter.address,
        //     walletCode: code 
        // }, code));

        // const deployer = await blockchain.treasury('deployer');


    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and jettonWallet are ready to use
        console.log("Sender's wallet address:  ",await jettonWallet.address);
        console.log("Balance of sender's wallet after deploying:  ",await jettonWallet.getBalance());
    });

    it('should mint tokens', async () => {
        const mintResult = await jettonMinter.sendMint(admin.getSender(), {
            value: toNano('0.2'),
            amount: toNano('0.05'),
            jettonAmount: toNano('495'),
            toAddress: admin.getSender().address as Address,
            queryId: Date.now()
        });
    });
    
    it('should return token balance', async () => {
        // check admin's balance
        const balance = await jettonMinter.getTotalsupply();
        console.log('balance', balance);

        console.log("Balance of sender's wallet after minting:  ",await jettonWallet.getBalance());

    });


    // it('Transfer Jetton', async () => {
    //     const deployer = await blockchain.treasury('deployer');
    //     console.log("B1");
    //     // const oldTotalSupply = await JSON.parse(JSON.stringify.prototype.toJSON.toString();
    //     // const oldTotalSupply = JSON.parse(JSON.stringify(await wallet.getBalance()));
    //     // console.log('TotalSupply before transfering:',oldTotalSupply);   
    //     // console.log("B2");

    //     const sendtransfer  = await jettonWallet.sendTransfer(admin.getSender(), {
    //         value: toNano('2'),
    //         fwdAmount: toNano('0.05'),
    //         jettonAmount: toNano('44'),
    //         // toAddress: receiver.address,
    //         toAddress: jettonWallet.address,
    //         queryId: Date.now()
    //     });
    //     // expect(sendtransfer.transactions).toHaveTransaction({
    //     //     from: admin.address,
    //     //     to: user.address,
    //     //     success: true,
    //     //     // outMessagesCount: 1,
    //     // });
    //     console.log("Check Balance");
    //     // expect(await wallet.getBalance()).toEqual(toNano('20'));
    //     // const newTotalSupply = await wallet.getBalance().toString();
    //     // console.log('Banlance of sender after transfering: ' ,jettonWallet.);
    //     // console.log('Banlance of receiver after transfering: ' ,wallet_receiver.getBalance().toString());

    //     console.log("Sender after transfer: ",await jettonMinter.getTotalsupply());
    //     console.log("Sender's balance after transfer:  ",await jettonWallet.getBalance());

    // });

});




