import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type LiquidityPoolConfig = {};

export function liquidityPoolConfigToCell(config: LiquidityPoolConfig): Cell {
    return beginCell().endCell();
}

export class LiquidityPool implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new LiquidityPool(address);
    }

    static createFromConfig(config: LiquidityPoolConfig, code: Cell, workchain = 0) {
        const data = liquidityPoolConfigToCell(config);
        const init = { code, data };
        return new LiquidityPool(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
