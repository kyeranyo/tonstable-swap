import { Address, beginCell, Cell, toNano, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

import { Token, TokenConfig } from './Token';
import BN from "bn.js";

// import op from "../contracts/imports/op";
import { OPS } from "./op-codes";

// export type JettonMinterConfig = {
//     // name: Slice;
//     adminAddress: Address;
//     content: Cell;
//     jettonWalletCode: Cell;
// };



export type JettonWalletConfig = {
    ownerAddress: Address;
    minterAddress: Address;
    walletCode: Cell;
    balance: bigint;
};



export function jettonWalletConfigToCell(config: JettonWalletConfig): Cell {
    return beginCell()
        // .storeCoins(0)
        .storeCoins(config.balance) /// balance
        .storeAddress(config.ownerAddress)
        .storeAddress(config.minterAddress)
        .storeRef(config.walletCode)
        .endCell();
}

export class JettonWallet implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new JettonWallet(address);
    }

    static createFromConfig(config: JettonWalletConfig, code: Cell, workchain = 0) {
        const data = jettonWalletConfigToCell(config);
        const init = { code, data };
        return new JettonWallet(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
    /////////////////////////////////////////////////////////////////////////////////
    // async updateBalance(provider: ContractProvider, via: Sender, value: bigint) {
    //     await provider.internal(via, {
    //         value,
    //         sendMode: SendMode.PAY_GAS_SEPARATELY,
    //         body: beginCell().endCell(),
    //     });
    // }

    /////////////////////////////////////////////////////////////////////////////////


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
                .storeCoins(opts.jettonAmount) //
                .storeAddress(opts.toAddress)
                .storeAddress(via.address)
                .storeUint(0, 1)
                // .storeDict(null)
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
    async getBalance(provider: ContractProvider): Promise<bigint> {
        const result = (await provider.get('get_wallet_balance', [])).stack;
        return result.readBigNumber();
    }


    async calculateTokenRates(provider: ContractProvider, amount: numb): Promise<bigint> {
        const result = (await provider.get('calculateTokenRates', [
            {
                type: 'bigint',
                cell: beginCell().storeCoins(amount).endCell(),
            } as any,
        ])).stack;
        return result.readBigNumber();
    }



    // async internalTransfer(provider: ContractProvider, via: Sender,
    //     opts: { //balance,owner_address,jetton_master_address,jetton_wallet_code
    //         value: bigint;
    //         balance: bigint;
    //         owner_address: Address;
    //         jetton_master_address: Address;
    //         jetton_wallet_code: Cell;
    //     }
    // ) {
    //     await provider.internal(via, {
    //         value: opts.value,
    //         sendMode: SendMode.PAY_GAS_SEPARATELY,
    //         body: beginCell()
    //         .storeUint(0x178d4519, 32)
    //         .storeCoins(opts.balance)
    //         .storeAddress(opts.owner_address)
    //         .storeAddress(opts.jetton_master_address)
    //         .storeRef(opts.jetton_wallet_code)
    //        .endCell(),

    //        begin_cell()
    //        .store_uint(op::internal_transfer(), 32)
    //        .store_uint(query_id, 64)
    //        .store_coins(jetton_amount)
    //        .store_slice(owner_address)
    //        .store_slice(response_address)
    //        .store_coins(forward_ton_amount)
    //        .store_slice(either_forward_payload)
    //        .end_cell();           
    //     });
    // }

}
