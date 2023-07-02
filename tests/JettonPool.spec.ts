import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { JettonPool } from '../wrappers/JettonPool';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('JettonPool', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('JettonPool');
    });

    let blockchain: Blockchain;
    let jettonPool: SandboxContract<JettonPool>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        jettonPool = blockchain.openContract(JettonPool.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await jettonPool.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonPool.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and jettonPool are ready to use
    });
});
