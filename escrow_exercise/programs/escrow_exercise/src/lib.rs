pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use state::*;
pub use instructions::*;

declare_id!("GdopSYJVVgib3WUQsCQRd5k8Kxf3Zth4uBSZ5ifvjM9T");

#[program]
pub mod escrow_exercise {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, seed: u64, deposit_amount: u64, receiver: u64) -> Result<()> {
        ctx.accounts.deposit(deposit_amount)?;
        ctx.accounts.init_escrow(seed, receiver, &ctx.bumps)?;
        Ok(())
    }

    pub fn refund(ctx: Context<Refund>) -> Result<()> {
        ctx.accounts.refund_and_close()
    }

    pub fn take(ctx: Context<Take>) -> Result<()> {
        ctx.accounts.deposit_into_vault()?;
        ctx.accounts.withdraw_and_close_account()
    }
}


