import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { JettonMinter } from '../wrappers/JettonMinter';
import '@ton-community/test-utils';
import { Address, beginCell } from 'ton-core';
import { compile, NetworkProvider } from '@ton-community/blueprint';
describe('JettonMinter', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('JettonMinter');
    });

    let blockchain: Blockchain;
    let jettonMinter: SandboxContract<JettonMinter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();


        const deployer = await blockchain.treasury('deployer');

        jettonMinter = blockchain.openContract(JettonMinter.createFromConfig({
            adminAddress: deployer.getSender().address,
            content: beginCell().storeUint(0, 256).endCell(),
            jettonWalletCode: await compile('JettonWallet')
        }, code));

        const deployResult = await jettonMinter.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMinter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and jettonMinter are ready to use
        console.log('JettonMinter address:', jettonMinter.address);
    });

    // it('should mint tokens', async () => {
    //     const deployer = await blockchain.treasury('deployer');
    //     const recipient = await blockchain.treasury('recipient');

    //     // mint some tokens for the deployer
    //     const mintAmount = toNano('1000');
    //     const mintResult = await jettonMinter.sendMint(deployer.getSender(), {
    //         value: toNano('0.2'),
    //         amount: toNano('0.05'),
    //         jettonAmount: toNano('100000'),
    //         toAddress: deployer.getSender().address as Address,
    //         queryId: Date.now()
    //     });
    // });

    // it('should return token balance', async () => {
    //     const deployer = await blockchain.treasury('deployer');

    //     console.log('JettonMinter address:', jettonMinter.address);
    //     console.log('deployer address:', deployer.getSender().address);
    //     let balance = await jettonMinter.getTotalsupply();
    //     console.log('balance before mint', balance);
    //     // mint some tokens for the deployer
    //     const mintAmount = toNano('1000');
    //     const mintResult = await jettonMinter.sendMint(deployer.getSender(), {
    //         value: toNano('0.2'),
    //         amount: toNano('0.05'),
    //         jettonAmount: toNano('500000'),
    //         toAddress: deployer.getSender().address as Address,
    //         queryId: Date.now()
    //     });
    //     // check deployer's balance
    //     balance = await jettonMinter.getTotalsupply();
    //     console.log('balance affter mint', balance);
    // });

});