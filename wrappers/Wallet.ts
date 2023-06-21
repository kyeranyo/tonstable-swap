import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type WalletConfig = {};

export function walletConfigToCell(config: WalletConfig): Cell {
    return beginCell().endCell();
}

export class Wallet implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Wallet(address);
    }

    static createFromConfig(config: WalletConfig, code: Cell, workchain = 0) {
        const data = walletConfigToCell(config);
        const init = { code, data };
        return new Wallet(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendTransfer(provider: ContractProvider, via: Sender,
        opts: {
            value: bigint;
            toAddress: Address;
            queryId: number;
            fwdAmount: bigint;
            jettonAmount: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xf8a7ea5, 32)
                .storeUint(opts.queryId, 64)
                .storeCoins(opts.jettonAmount)
                .storeAddress(opts.toAddress)
                .storeAddress(via.address)
                .storeUint(0, 1)
                .storeCoins(opts.fwdAmount)
                .storeUint(0, 1)
            .endCell(),
        });
    }

    async sendBurn(provider: ContractProvider, via: Sender,
        opts: {
            value: bigint;
            queryId: number
            jettonAmount: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x595f07bc, 32)
                .storeUint(opts.queryId, 64)
                .storeCoins(opts.jettonAmount)
                .storeAddress(via.address)
                .storeUint(0, 1)
            .endCell(),
        });
    }  

// with internal transfer we create new function
async sendTransfer_internal(provider: ContractProvider, via: Sender,
    opts: {
        value: bigint;
        toAddress: Address;
        queryId: number;
        fwdAmount: bigint;
        jettonAmount: bigint;
    }
) {
    await provider.internal(via, {
        value: opts.value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: beginCell()
            .storeUint(0x178d4519, 32) //change op value: op::internal_tranfer, check value in contract/imports/op-codes.fc
            .storeUint(opts.queryId, 64)
            .storeCoins(opts.jettonAmount)
            .storeAddress(opts.toAddress)
            .storeAddress(via.address)
            .storeUint(0, 1)
            .storeCoins(opts.fwdAmount)
            .storeUint(0, 1)
        .endCell(),
    });
}

}
