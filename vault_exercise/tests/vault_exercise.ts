import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VaultExercise } from "../target/types/vault_exercise";

describe("vault_exercise", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.VaultExercise as Program<VaultExercise>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });

  it('should deposit', async () => {
    const tx = await program.methods.deposit(new anchor.BN(1000000000)).rpc();
    console.log('Your transaction signature', tx);
  });

  it('should withdraw', async () => {
    const tx = await program.methods.withdraw(new anchor.BN(1000000000)).rpc();
    console.log('Your transaction signature', tx);
  });
});
