import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type JettonPoolConfig = {};

export function jettonPoolConfigToCell(config: JettonPoolConfig): Cell {
    return beginCell().endCell();
}

export class JettonPool implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new JettonPool(address);
    }

    static createFromConfig(config: JettonPoolConfig, code: Cell, workchain = 0) {
        const data = jettonPoolConfigToCell(config);
        const init = { code, data };
        return new JettonPool(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
