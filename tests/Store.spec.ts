import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Store } from '../wrappers/Store';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Store', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Store');
    });

    let blockchain: Blockchain;
    let store: SandboxContract<Store>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        store = blockchain.openContract(Store.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await store.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: store.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and store are ready to use
    });
});
