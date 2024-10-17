import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { wallet } from "../wba-wallet";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(bs58.decode(wallet)));

//Create a Solana devnet connection
const connection = new Connection("https://api.devnet.solana.com", {
  commitment: "confirmed",
});

(async () => {
  try {
    // Start here
    const mint = await createMint(
      connection,
      keypair,
      keypair.publicKey,
      null,
      6,
    );
    console.log("Mint Address: ", mint.toBase58());
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
