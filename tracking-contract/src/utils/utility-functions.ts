import { Context } from 'fabric-contract-api';
import { Iterators } from 'fabric-shim';

type Iterator = (Promise<Iterators.StateQueryIterator> & AsyncIterable<Iterators.KV>) | (Promise<Iterators.HistoryQueryIterator> & AsyncIterable<Iterators.KeyModification>);

export async function iterateOverResults(iterator: Iterator) {
  const allResults = [];
  for await (const res of iterator) {
      try {
          allResults.push(allResults.push(res.value.toString()));
      } catch (err) {
          console.error(err);
      }
  }

  return allResults;
}

export const exists = (data: Uint8Array) => (!!data && data.length > 0);

export function checkAuthorization(ctx: Context, allowedMSP: string) {
    if (ctx.clientIdentity.getMSPID() !== allowedMSP) {
        throw new Error('Organization not authorized to access this resource');
    }
}
