import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { Cell, toNano, Address, beginCell } from 'ton-core';
import { JettonWallet } from '../wrappers/Pool';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { Token } from '../wrappers/Token';


// import BN from "bn.js";


// import chai, { expect } from "chai";
// import chaiBN from "chai-bn";
// import BN from "bn.js";
// chai.use(chaiBN(BN));

describe('JettonWallet', () => {
    let code: Cell;
    let blockchain: Blockchain;
    let jettonWallet_sender: SandboxContract<JettonWallet>;
    let jettonWallet_receiver: SandboxContract<JettonWallet>;


    let admin: SandboxContract<TreasuryContract>;
    let token: SandboxContract<Token>;


    let user: SandboxContract<TreasuryContract>;
    let receiver: SandboxContract<Token>;

    // let balance_wallet: bigint;

    beforeAll(async () => {
        code = await compile('JettonWallet');
        // });
        // beforeEach(async () => {
        blockchain = await Blockchain.create();
        admin = await blockchain.treasury('admin');
        user = await blockchain.treasury('user');

        ////////////////////DEPLOY SENDER AND RECEIVER/////////////////////

        token = blockchain.openContract(Token.createFromConfig({
            adminAddress: admin.getSender().address,
            content: beginCell().storeUint(0, 256).endCell(),
            jettonWalletCode: code
        }, code));
        // await Token.sendDeploy(admin.getSender(), toNano('0.05'));
        const deployResult = await token.sendDeploy(admin.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: admin.address,
            to: token.address,
            deploy: true,
            success: true,
        });


        receiver = blockchain.openContract(Token.createFromConfig({
            adminAddress: user.getSender().address,
            content: beginCell().storeUint(0, 256).endCell(),
            jettonWalletCode: await compile('JettonWallet')
        }, code));
        await receiver.sendDeploy(user.getSender(), toNano('0.05'));

        // it('get balance', async () => { 
        //     balance_wallet = await Token.getTotalsupply();
        // });
        /////////////////////    DEPLOY SENDER'S WALLET     ///////////////////////////
        // jettonWallet_sender = blockchain.openContract(JettonWallet.createFromConfig({
        //     ownerAddress: admin.address,
        //     minterAddress: admin.getSender().address,
        //     walletCode: code,
        //     balance: toNano(1000n) //BigInt(await Token.getTotalsupply())
        // }, code));
        jettonWallet_sender = blockchain.openContract(JettonWallet.createFromConfig({
            ownerAddress: admin.address,
            minterAddress: admin.getSender().address,
            walletCode: code,
            balance: toNano(1000n) //BigInt(await Token.getTotalsupply())
        }, code));
        const deployResult_wallet_sender = await jettonWallet_sender.sendDeploy(admin.getSender(), toNano('0.05'));

        expect(deployResult_wallet_sender.transactions).toHaveTransaction({
            from: admin.address,
            to: jettonWallet_sender.address,
            deploy: true,
            success: true,
        });
        /////////////////////    DEPLOY RECEIVER'S WALLET     ///////////////////////////
        jettonWallet_receiver = blockchain.openContract(JettonWallet.createFromConfig({
            ownerAddress: user.address,
            minterAddress: user.getSender().address,
            walletCode: code,
            balance: 0n
        }, code));
        const deployResult_wallet_receiver = await jettonWallet_receiver.sendDeploy(user.getSender(), toNano('0.05'));

        expect(deployResult_wallet_receiver.transactions).toHaveTransaction({
            from: user.address,
            to: jettonWallet_receiver.address,
            deploy: true,
            success: true,
        });

        /////////////////////////////////////////////////////////////////////////////////


    });
    // it('should deploy', async () => {});

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and jettonWallet are ready to use
        console.log("DEPLOYING");
        console.log("Sender's wallet address:  ", await jettonWallet_sender.address);
        console.log("Receiver's wallet address  ", await jettonWallet_receiver.address);
        // console.log("Balance of sender's wallet after deploying:  ",await jettonWallet.getBalance());
    });

    it('should mint tokens', async () => {
        console.log("MINTING");

        const mintResult = await token.sendMint(admin.getSender(), {
            value: toNano('0.2'),
            amount: toNano('0.05'),
            jettonAmount: toNano('495'),
            // toAddress: admin.getSender().address as Address,
            toAddress: admin.getSender().address as Address,

        });
    });

    it('should return token balance', async () => {
        // check admin's balance
        // const balance = await Token.getTotalsupply();
        // console.log('balance', balance);
        // console.log("Sender's wallet address:  ",await jettonWallet_sender.address);
        // console.log("Balance of sender's wallet after minting:  ",await jettonWallet_sender.getBalance());
        // console.log("Receiver's wallet address  ",await jettonWallet_sender.address);

        console.log("Balance of sender's wallet after minting:  ", await jettonWallet_sender.getBalance());

    });


    it('should burn balance', async () => {
        const sendtransfer = await jettonWallet_sender.sendBurn(admin.getSender(), {
            value: toNano('5'),
            queryId: Date.now(),
            jettonAmount: toNano('63')
        });
        console.log("Balance of sender's wallet after burning:  ", await jettonWallet_sender.getBalance());
    });

    it('should return token balance', async () => {
        console.log("Balance of sender's wallet:  ", await jettonWallet_sender.getBalance());
    });



    it('Transfer Jetton', async () => {
        const deployer = await blockchain.treasury('deployer');
        console.log("TRANSFERING...");
        // const oldTotalSupply = await JSON.parse(JSON.stringify.prototype.toJSON.toString();
        // const oldTotalSupply = JSON.parse(JSON.stringify(await wallet.getBalance()));
        // console.log('TotalSupply before transfering:',oldTotalSupply);   
        // console.log("B2");
        const sender1 = admin.getSender();
        const receiver1 = user.getSender();
        const sendtransfer = await jettonWallet_sender.sendTransfer(sender1, {
            value: toNano('1'),
            toAddress: user.address as Address,
            queryId: Date.now(),
            fwdAmount: toNano('0.05'),
            // fwdAmount: toNano('1'),
            jettonAmount: toNano('27')
        });
        expect(sendtransfer.transactions).toHaveTransaction({
            from: sender1.address,
            to: jettonWallet_sender.address,
            success: true,
            outMessagesCount: 1,
        });
        console.log("Check Balance");
        // expect(await wallet.getBalance()).toEqual(toNano('20'));
        // const newTotalSupply = await wallet.getBalance().toString();
        // console.log('Banlance of sender after transfering: ' ,jettonWallet.);
        // console.log('Banlance of receiver after transfering: ' ,wallet_receiver.getBalance().toString());

        // console.log("Sender after transfer: ",await Token.getTotalsupply());
        console.log("Receiver's balance after transfering:  ", await jettonWallet_receiver.getBalance());
        console.log("Sender's balance after transfering:  ", await jettonWallet_sender.getBalance());
    });


    it('should return calculateTokenRates', async () => {
        let amount = toNano(100);
        const result = await jettonWallet_sender.calculateTokenRates(toNano(100n));
        console.log("calculateTokenRates:  ", result);
    });


});

