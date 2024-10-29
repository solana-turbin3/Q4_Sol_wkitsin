use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

declare_id!("DjKZePSRbdvmww77tfyezWwjrQPXJ5DZvv9UdGKSEt9P");

#[account]
#[derive(InitSpace)]
pub struct VaultState {
    pub vault_bump: u8,
    pub state_bump: u8,
}


#[program]
pub mod vault_exercise {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize(&ctx.bumps)
    }

    pub fn deposit(ctx: Context<Payment>, amount: u64) -> Result<()> {
        ctx.accounts.deposit(amount)
    }

    pub fn withdraw(ctx: Context<Payment>, amount: u64) -> Result<()> {
        ctx.accounts.withdraw(amount)
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(init, payer = user, space = 8 + VaultState::INIT_SPACE, seeds = [b"state", user.key().as_ref()], bump)]
    pub state: Account<'info, VaultState>,

    #[account(seeds = [b"vault".as_ref()], bump)]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, bumps: &InitializeBumps) -> Result<()> {
        self.state.vault_bump = bumps.vault;
        self.state.state_bump = bumps.state;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Payment<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        seeds = [b"state", user.key().as_ref()],
        bump = state.state_bump,
    )]
    pub state: Account<'info, VaultState>,

    #[account(
        mut,
        seeds = [b"state", user.key().as_ref()],
        bump = state.state_bump,
    )]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> Payment<'info> {
    pub fn deposit(&mut self, amount: u64) -> Result<()> {

        let cpi_program: AccountInfo<'_> = self.system_program.to_account_info();


        let cpi_acconts = Transfer {
            from: self.user.to_account_info(),
            to: self.vault.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_acconts);

        transfer(cpi_ctx, amount)?;

        Ok(())
    }

    pub fn withdraw(&mut self, amount: u64) -> Result<()> {
        let cpi_program: AccountInfo<'_> = self.system_program.to_account_info();


        let cpi_acconts = Transfer {
            from: self.vault.to_account_info(),
            to: self.user.to_account_info(),
        };

        let seeds = &[
            b"vault",
            self.state.to_account_info().key.as_ref(),
            &[self.state.vault_bump]
        ];

        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_acconts, signer_seeds);

        transfer(cpi_ctx, amount)?;

        Ok(())
    }
}