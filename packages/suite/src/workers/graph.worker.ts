/* eslint-disable no-restricted-globals */
import { aggregateBalanceHistory } from '@wallet-utils/graphUtils';
import { GraphMessageEventRequest } from '@wallet-types/fiatRates';

const ctx: Worker = self as any;

ctx.addEventListener('message', (event: GraphMessageEventRequest) => {
    const result = aggregateBalanceHistory(event.data.history, event.data.groupBy, event.data.type);
    ctx.postMessage(result);
});

// // Trickery to fix TypeScript since this will be done by "worker-loader"
export default {} as typeof Worker & (new () => Worker);
