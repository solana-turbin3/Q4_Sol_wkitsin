import { wallet } from "../wba-wallet";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(bs58.decode(wallet))
);
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    //1. Load image
    //2. Convert image to generic file.
    //3. Upload image
    // https://devnet.irys.xyz/DqTJkVD2nDh2GPdbi6xQfcP3dbMppxT5yUMaE9UTmLRV

    const image = await readFile("./image/generug.png");
    const genericFile = createGenericFile(image, "rug.png", {
      contentType: "image/png",
      extension: "png",
    });
    const [myUri] = await umi.uploader.upload([genericFile]);

    console.log("Your image URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
