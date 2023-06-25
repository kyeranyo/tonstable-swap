// int op::transfer() asm "0xf8a7ea5 PUSHINT";
// int op::transfer_notification() asm "0x7362d09c PUSHINT";
// int op::internal_transfer() asm "0x178d4519 PUSHINT";
// int op::excesses() asm "0xd53276db PUSHINT";
// int op::burn() asm "0x595f07bc PUSHINT";
// int op::burn_notification() asm "0x7bdd97de PUSHINT";

// ;; Minter
// int op::mint() asm "21 PUSHINT";


export enum OPS {
    Transfer = 0xf8a7ea5,
    Transfer_notification = 0x7362d09c,
    Internal_transfer = 0x178d4519,
    Excesses = 0xd53276db,
    Burn = 0x595f07bc,
    Burn_notification = 0x7bdd97de,
    // ClaimRewards = 0x5a3e000,
    // ClaimRewardsNotification = 0x5a3e001,
    Mint = 21,
    InternalTransfer = 0x178d4519,
}
  