import { Blockchain, SandboxContract, TreasuryContract} from '@ton-community/sandbox';
import {beginCell, Cell, toNano } from 'ton-core';
import { Wallet } from '../wrappers/Wallet';
import {randomAddress} from '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { Minter } from '../wrappers/Minter';

import '@ton-community/test-utils';


describe('Wallet', () => {
    let code: Cell;
    let codeminter: Cell;

    let randomadress = randomAddress();
    let blockchain: Blockchain;
    let wallet: SandboxContract<Wallet>;


    let admin: SandboxContract<TreasuryContract>;
    let sender: SandboxContract<Minter>;
    

    let user: SandboxContract<TreasuryContract>;
    let receiver: SandboxContract<Minter>;

// temporarily initialize variables for all test blocks it
    beforeAll(async () => {
        code = await compile('Wallet');
        codeminter = await compile('Minter');

    // });

    // beforeEach(async () => {
        blockchain = await Blockchain.create();
        admin = await blockchain.treasury('admin');
        user = await blockchain.treasury('user');

        sender = blockchain.openContract(Minter.createFromConfig({
            adminAddress: admin.address,
            jettonWalletCode: await compile('Wallet')
        }, codeminter));

        receiver = blockchain.openContract(Minter.createFromConfig({
            adminAddress: user.address,
            jettonWalletCode: code
        }, codeminter));        

///////////////////////////////////////////////////////////////////////////////////////
        // const deployer_receiver = await blockchain.treasury('deployer');
        const deployResult_receiver = await receiver.sendDeploy(admin.getSender(), toNano('0.05'));

        // const deployer_sender = await blockchain.treasury('deployer');
        const deployResult_sender = await sender.sendDeploy(user.getSender(), toNano('0.05'));
        // expect(deployResult_minter.transactions).toHaveTransaction({
        //     from: deployer_minter.address,
        //     to: receiver.address,
        //     deploy: true,
        //     success: true,
        // });

///////////////////////////////////////////////////////////////////////////////////////



        wallet = blockchain.openContract(Wallet.createFromConfig({}, code));
        // wallet = blockchain.openContract(Wallet.createFromAddress(receiver.address));
        // let deployer = await blockchain.treasury('deployer');
        const deployResult = await wallet.sendDeploy(admin.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: admin.address,
            to: wallet.address,
            deploy: true,
            success: true,
        });
    });


//////////////////Write blocks test/////////////////////////////////////////////////////////
    it('should mint jettons for sender', async () => {
        const res = await sender.sendMint(admin.getSender(), {
            value: toNano('0.1'),
            toAddress: user.address,
            amount: toNano('0.05'),
            jettonAmount: toNano('100'),
        });

        expect(res.transactions).toHaveTransaction({
            from: admin.address,
            to: sender.address,
            success: true,
            op: 21,
            outMessagesCount: 1,
        });



        ////////////////////////////////////////////////////
        const res2 = await sender.sendMint(admin.getSender(), {
            value: toNano('0.1'),
            toAddress: user.address,
            amount: toNano('0.05'),
            jettonAmount: toNano('45'),
        });

        ////////////////////////////////////////////////////
        const newTotalSupply = await sender.getTotalSupply();
        console.log(newTotalSupply);
        // expect(newTotalSupply).toEqual(toNano('100'));
    });



    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and wallet are ready to use
    });

    it('Transfer Jetton', async () => {
        // const deployer = await blockchain.treasury('deployer');
        console.log("B1");
        // const oldTotalSupply = await JSON.parse(JSON.stringify.prototype.toJSON.toString();
        // const oldTotalSupply = JSON.parse(JSON.stringify(await wallet.getBalance()));
        // console.log('TotalSupply before transfering:',oldTotalSupply);   
        // console.log("B2");

        const sendtransfer  = await wallet.sendTransfer(admin.getSender(), {
            value: toNano('2'),
            fwdAmount: toNano('0.05'),
            jettonAmount: toNano('20'),
            toAddress: receiver.address,
            queryId: Date.now()
        });
        // expect(sendtransfer.transactions).toHaveTransaction({
        //     from: admin.address,
        //     to: user.address,
        //     success: true,
        //     outMessagesCount: 1,
        // });
        console.log("Check Balance");
        // expect(await wallet.getBalance()).toEqual(toNano('20'));
        // const newTotalSupply = await wallet.getBalance().toString();
        // console.log('TotalSupply after transfering: ' ,newTotalSupply);

        console.log("Sender after transfer: ",await sender.getTotalSupply());
        console.log("Receiver after transfer: ",await receiver.getTotalSupply());

    });


    // it("Transfer", async () => {
    //     const res = await sender.sendCallTo(admin.getSender(), {
    //         toAddress: user.address,
    //         masterMsg: beginCell()
    //                 .storeUint(0x595f07bc, 32)
    //                 .storeUint(0, 64)
    //                 .storeCoins(toNano('20'))
    //                 .storeAddress(randomAddress())
    //                 .storeMaybeRef(beginCell().endCell())
    //             .endCell(),

    //         value: toNano('2.5'),
    //         amount: toNano('20')
    //     });

    //     // expect(res.transactions).toHaveTransaction({
    //     //     from: admin.address,
    //     //     to: user.address,
    //     //     success: true,
    //     //     op: 6,
    //     //     outMessagesCount: 1
    //     // });
    // });
});
















