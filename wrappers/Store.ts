import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type StoreConfig = {};

export function storeConfigToCell(config: StoreConfig): Cell {
    return beginCell().endCell();
}

export class Store implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Store(address);
    }

    static createFromConfig(config: StoreConfig, code: Cell, workchain = 0) {
        const data = storeConfigToCell(config);
        const init = { code, data };
        return new Store(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
