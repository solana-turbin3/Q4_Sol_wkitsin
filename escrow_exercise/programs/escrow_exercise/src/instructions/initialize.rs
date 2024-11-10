use anchor_lang::prelude::*;
use anchor_spl::token_interface::{transfer_checked, TokenAccount, Mint, TokenInterface, TransferChecked};
use anchor_spl::associated_token::AssociatedToken;

use crate::Escrow;

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct Initialize<'info > {
    #[account(mut)]
    pub maker: Signer<'info>,

    #[account(
        mint::token_program = token_program
    )]
    pub mint_a: InterfaceAccount<'info, Mint>,

    #[account(
        mint::token_program = token_program
    )]
    pub mint_b: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = mint_a,
        associated_token::authority = maker,
        associated_token::token_program = token_program,
    )]
    pub maker_ata_a: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init,
        payer = maker,
        space = 8 + Escrow::INIT_SPACE,
        seeds = [b"escrow", maker.key().as_ref(), seed.to_le_bytes().as_ref()],
        bump,
    )]
    pub escrow: Account<'info, Escrow>,

    // Why no need bump and seeds?
    #[account(
        init,
        payer = maker,
        associated_token::mint = mint_a,
        associated_token::authority = maker,
        associated_token::token_program = token_program,
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn init_escrow(&mut self, seed: u64, receive: u64, bumps: &InitializeBumps) -> Result<()> {
        self.escrow.set_inner(Escrow {
            seed,
            receive,
            maker: self.maker.key(),
            mint_a: self.mint_a.key(),
            mint_b: self.mint_b.key(),
            bump: bumps.escrow,
        });

        Ok(())
    }

    pub fn deposit(&mut self, amount: u64) -> Result<()> {
        let transfer_account = TransferChecked {
            from: self.maker_ata_a.to_account_info(),
            to: self.vault.to_account_info(),
            authority: self.maker.to_account_info(),
            mint: self.mint_a.to_account_info()
        };

        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), transfer_account);

        transfer_checked(cpi_ctx, amount, self.mint_a.decimals)

    }
}