/**
 * @import {GuestOf} from '@agoric/async-flow';
 * @import {Amount} from '@agoric/ertp/src/types.js';
 * @import {Marshaller, StorageNode} from '@agoric/internal/src/lib-chainStorage.js';
 * @import {ChainAddress, Orchestrator} from '@agoric/orchestration';
 * @import {ZoeTools} from '@agoric/orchestration/src/utils/zoe-tools.js';
 * @import {Transfer} from './orca.contract.js';
 * @import {DenomArg} from '@agoric/orchestration';

 */

import { M, mustMatch } from '@endo/patterns';
import { makeTracer } from './debug.js';

const trace = makeTracer('ChessFlows');

/**
 * Create an account on a Cosmos chain and return a continuing offer with
 * invitations makers for Delegate, WithdrawRewards, Transfer, etc.
 *
 * @param {Orchestrator} orch
 * @param {unknown} _ctx
 * @param {ZCFSeat} seat
 * @param {{ chainName: string, denom: string }} offerArgs
 */
export const doMove = async (orch, _ctx, seat, offerArgs) => {
  trace('makeAccount');
  // mustMatch(offerArgs, M.splitRecord({ chainName: M.string() }));
  // const { chainName } = offerArgs;
  // trace('chainName', chainName);
  // seat.exit();
  // const chain = await orch.getChain(chainName);
  // const chainAccount = await chain.makeAccount();
  // trace('chainAccount', chainAccount);
  // return chainAccount.asContinuingOffer();
};
harden(doMove);

