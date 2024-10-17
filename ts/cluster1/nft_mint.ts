import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import { wallet } from "../wba-wallet";
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(base58.decode(wallet))
);
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);

(async () => {
  let tx = createNft(umi, {
    mint,
    name: "madrug",
    uri: "https://devnet.irys.xyz/D7ZHGoXh7SuU2xh5f573mGeGQoK8Yaict48ZJ5raNwPe",
    sellerFeeBasisPoints: percentAmount(0),
  });

  let result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  //   https://explorer.solana.com/tx/2SmxammBDXj7CNoC1db5tPyBgTsnN3sQ9bbXbvRKJnMT3C9zaDGU9zioi5EdM7KpRsL8hpTJoWWm6knuqZWsXchU?cluster=devnet
  console.log(
    `Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
  );

  console.log("Mint Address: ", mint.publicKey);
})();
