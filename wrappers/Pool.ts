import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type PoolConfig = {};

export function poolConfigToCell(config: PoolConfig): Cell {
    return beginCell().endCell();
}

export class Pool implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new Pool(address);
    }

    static createFromConfig(config: PoolConfig, code: Cell, workchain = 0) {
        const data = poolConfigToCell(config);
        const init = { code, data };
        return new Pool(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async get_balance(provider: ContractProvider): Promise<bigint> {
        const result = (await provider.get('get_balance', [])).stack;
        return result.readBigNumber();
    }


    async calculateTokenSwapRate(provider: ContractProvider): Promise<bigint> {
        const result = (await provider.get('calculateTokenSwapRate', [])).stack;
        return result.readBigNumber();
    }

    async doSomeThing(provider: ContractProvider): Promise<bigint> {
        const result = (await provider.get('doSomeThing', [])).stack;
        return result.readBigNumber();
    }
}




