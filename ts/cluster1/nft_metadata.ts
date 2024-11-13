import { wallet } from "../wba-wallet";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
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
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

    // const image = ???
    const metadata = {
      name: "kitRug",
      symbol: "kit-rug",
      description: "i will rug you",
      image:
        "https://devnet.irys.xyz/DqTJkVD2nDh2GPdbi6xQfcP3dbMppxT5yUMaE9UTmLRV",
      attributes: [
        { trait_type: "background", value: "purple" },
        { trait_type: "movement", value: "fly" },
      ],
      properties: {
        files: [
          {
            type: "image/png",
            uri: "https://devnet.irys.xyz/DqTJkVD2nDh2GPdbi6xQfcP3dbMppxT5yUMaE9UTmLRV",
          },
        ],
      },
      creators: [],
    };

    // https://devnet.irys.xyz/D7ZHGoXh7SuU2xh5f573mGeGQoK8Yaict48ZJ5raNwPe
    const myUri = await umi.uploader.uploadJson(metadata);
    console.log("Your metadata URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
