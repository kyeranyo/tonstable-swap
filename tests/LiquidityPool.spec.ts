import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { LiquidityPool } from '../wrappers/LiquidityPool';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('LiquidityPool', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('LiquidityPool');
    });

    let blockchain: Blockchain;
    let liquidityPool: SandboxContract<LiquidityPool>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        liquidityPool = blockchain.openContract(LiquidityPool.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await liquidityPool.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: liquidityPool.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and liquidityPool are ready to use
    });
});
