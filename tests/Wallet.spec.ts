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
        const deployer_receiver = await blockchain.treasury('deployer');
        const deployResult_receiver = await receiver.sendDeploy(deployer_receiver.getSender(), toNano('0.05'));

        const deployer_sender = await blockchain.treasury('deployer');
        const deployResult_sender = await sender.sendDeploy(deployer_sender.getSender(), toNano('0.05'));
        // expect(deployResult_minter.transactions).toHaveTransaction({
        //     from: deployer_minter.address,
        //     to: receiver.address,
        //     deploy: true,
        //     success: true,
        // });

///////////////////////////////////////////////////////////////////////////////////////



        wallet = blockchain.openContract(Wallet.createFromConfig({}, code));
        let deployer = await blockchain.treasury('deployer');
        const deployResult = await wallet.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
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

        const newTotalSupply = await sender.getTotalSupply();
        console.log(newTotalSupply);
        expect(newTotalSupply).toEqual(toNano('100'));

    });



    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and wallet are ready to use
    });

    it('Transfer Jetton', async () => {
        // const deployer = await blockchain.treasury('deployer');
        console.log("B1");
        const oldTotalSupply = await receiver.getTotalSupply();
        console.log('TotalSupply before transfering:',oldTotalSupply);   
        console.log("B2");

        const sendtransfer  = await wallet.sendTransfer_internal(admin.getSender(), {
            value: toNano('0.2'),
            fwdAmount: toNano('0.05'),
            jettonAmount: toNano('20'),
            toAddress: receiver.address,
            queryId: Date.now()
        });
        expect(sendtransfer.transactions).toHaveTransaction({
            from: admin.address,
            to: receiver.address,
            success: true,
            // op: 21,
            // outMessagesCount: 1,
        });
        console.log("B3");
        const newTotalSupply = await receiver.getTotalSupply();
        console.log('TotalSupply after transfering: ' ,newTotalSupply);
        // console.log(randomAddress);
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





























// import { Blockchain, SandboxContract, TreasuryContract, printTransactionFees } from '@ton-community/sandbox';
// import { beginCell, Cell, loadTransaction, toNano } from 'ton-core';
// import { Minter } from '../wrappers/Minter';
// import '@ton-community/test-utils';
// import { compile } from '@ton-community/blueprint';
// import { randomAddress } from '@ton-community/test-utils';

// describe('Minter', () => {
//     let code: Cell;
//     let blockchain: Blockchain;
//     let minter: SandboxContract<Minter>;
//     let admin: SandboxContract<TreasuryContract>;
//     let user: SandboxContract<TreasuryContract>;

//     beforeAll(async () => {
//         code = await compile('Minter');
//     });

//     beforeEach(async () => {
//         blockchain = await Blockchain.create();
//         admin = await blockchain.treasury('admin');
//         user = await blockchain.treasury('user');

//         minter = blockchain.openContract(Minter.createFromConfig({
//             adminAddress: admin.address,
//             jettonWalletCode: await compile('Wallet')
//         }, code));

//         const deployer = await blockchain.treasury('deployer');

//         const deployResult = await minter.sendDeploy(deployer.getSender(), toNano('0.05'));

//         expect(deployResult.transactions).toHaveTransaction({
//             from: deployer.address,
//             to: minter.address,
//             deploy: true,
//             success: true,
//         });
//     });

//     it('should deploy', async () => {
//         // the check is done inside beforeEach
//         // blockchain and minter are ready to use
//     });

//     it('should mint jettons', async () => {
//         const res = await minter.sendMint(admin.getSender(), {
//             value: toNano('0.1'),
//             toAddress: user.address,
//             amount: toNano('0.05'),
//             jettonAmount: toNano('100'),
//         });

//         expect(res.transactions).toHaveTransaction({
//             from: admin.address,
//             to: minter.address,
//             success: true,
//             op: 21,
//             outMessagesCount: 1,
//         });

//         const newTotalSupply = await minter.getTotalSupply();
//         console.log(newTotalSupply);
//         expect(newTotalSupply).toEqual(toNano('100'));

//     });

//     it("should be able to send master messages to holder's wallet", async () => {
//         const res = await minter.sendCallTo(admin.getSender(), {
//             toAddress: user.address,
//             masterMsg: beginCell()
//                     .storeUint(0x595f07bc, 32)
//                     .storeUint(0, 64)
//                     .storeCoins(toNano('20'))
//                     .storeAddress(randomAddress())
//                     .storeMaybeRef(beginCell().endCell())
//                 .endCell(),

//             value: toNano('2.5'),
//             amount: toNano('2')
//         });

//         expect(res.transactions).toHaveTransaction({
//             from: admin.address,
//             to: minter.address,
//             success: true,
//             op: 6,
//             outMessagesCount: 1
//         });
//     });

//     it("should throw 37 exit code in case of insufficient balance", async () => {
//         const res = await minter.sendCallTo(admin.getSender(), {
//             toAddress: user.address,
//             masterMsg: beginCell()
//                     .storeUint(0x595f07bc, 32)
//                     .storeUint(0, 64)
//                     .storeCoins(toNano('20'))
//                     .storeAddress(randomAddress())
//                     .storeMaybeRef(beginCell().endCell())
//                 .endCell(),

//             value: toNano('0.5'),
//             amount: toNano('2')
//         });

//         expect(res.transactions).toHaveTransaction({
//             from: admin.address,
//             to: minter.address,
//             success: false,
//             aborted: true,
//             op: 6,
//             actionResultCode: 37
//         });
//     });

//     it('should upgrade code and data', async () => {

//         const transferAdminAddress = randomAddress();

//         const newDataCell = beginCell()
//                         .storeCoins(0)
//                         .storeAddress(admin.address)
//                         .storeAddress(transferAdminAddress)
//                         .storeRef(await compile('Wallet'))
//                     .endCell();

//         const res = await minter.sendUpgradeMinter(admin.getSender(), {
//             newData: newDataCell,
//             newCode: new Cell(),
//             value: toNano('0.05')
//         });

//         expect(res.transactions).toHaveTransaction({
//             from: admin.address,
//             to: minter.address,
//             success: true,
//         });

//         expect(res.transactions)

//         const state = (await blockchain.getContract(minter.address)).accountState;

//         if (state?.type !== 'active') throw new Error('state is not active');

//         expect(state.state.code?.equals(new Cell())).toBeTruthy();

//         expect(state.state.data?.equals(newDataCell)).toBeTruthy();
//     });



// });
