import { getTransactionsByContract } from "./planetscale.js";

export async function resolveHackernoonSig(sig) {
  try {
    const contractTxs = await getTransactionsByContract(
      "rxDNIirqwTxVRNcPZHAWVEZbvypNJ00JJS2X0nfRsDQ",
    );
    for (const tx of contractTxs) {
      const inputs = JSON.parse(tx.input);

      if (inputs.sig.toLowerCase() === sig.toLowerCase()) {
        return { txid: tx.pseudo_id };
      }
    }
    return { txid: null };
  } catch (error) {
    console.log(error);
  }
}
