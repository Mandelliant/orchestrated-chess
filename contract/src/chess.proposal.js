import { E } from '@endo/far';
import { installContract } from './platform-goals/start-contract.js';
import { makeTracer } from './tools/debug.js';

/// <reference types="@agoric/vats/src/core/types-ambient"/>
/// <reference types="@agoric/zoe/src/contractFacet/types-ambient"/>

/**
 * @import {ERef} from '@endo/far';
 * @import {BootstrapManifest} from '@agoric/vats/src/core/lib-boot.js';
 * @import {ChainInfo, IBCConnectionInfo,} from '@agoric/orchestration';
 * @import {OrcaSF} from './orca.contract.js';
 * @import {ContractStartFunction} from '@agoric/zoe/src/zoeService/utils.js';
 */

const trace = makeTracer('OrCE');
const { entries, fromEntries } = Object;

trace('start proposal module evaluating');

const contractName = 'chess';

/** @type {IBCConnectionInfo} */
const c1 = harden({
  id: 'connection-0',
  client_id: 'client-0',
  state: 3, // OPEN
  counterparty: harden({
    client_id: 'client-0',
    connection_id: 'connection-0',
    prefix: {
      key_prefix: 'key-prefix-0',
    },
  }),
  transferChannel: harden({
    portId: 'transfer',
    channelId: 'channel-0',
    counterPartyPortId: 'transfer',
    counterPartyChannelId: 'channel-1',
    ordering: 2, // ORDERED
    version: '1',
    state: 3, // OPEN
  }),
});

// TODO: rename chainDetails to defaultChainDetails? or move back to test?
/** @type {Record<string, ChainInfo>} */
export const chainDetails = harden({
  agoric: {
    chainId: `agoriclocal`,
    stakingTokens: [{ denom: 'ubld' }],
    connections: { osmosislocal: c1 },
  },
  osmosis: {
    chainId: `osmosislocal`,
    stakingTokens: [{ denom: 'uosmo' }],
  },
});

/**
 * Given a record whose values may be promise, return a promise for a record with all the values resolved.
 *
 * @type { <T extends Record<string, ERef<any>>>(obj: T) => Promise<{ [K in keyof T]: Awaited<T[K]>}> }
 */
export const allValues = async obj => {
  const es = await Promise.all(
    entries(obj).map(([k, vp]) => E.when(vp, v => [k, v])),
  );
  return fromEntries(es);
};

/**
 * @param {BootstrapPowers & {installation: {consume: {orca: Installation<OrcaSF>}}}} permittedPowers
 * @param {{options: {[contractName]: {
 *   bundleID: string;
 *   chainDetails: Record<string, ChainInfo>,
 * }}}} config
 */
export const startChessContract = async (permittedPowers, config) => {
  trace('startChessContract()... 0.0.93', config);
  console.log(permittedPowers);
  console.log(config);
  const {
    consume: {
      agoricNames,
      board,
      chainTimerService,
      localchain,
      chainStorage,
      cosmosInterchainService,
      startUpgradable,
    },
    installation: {
      consume: { chess: orcaInstallation },
    },
    instance: {
      // @ts-expect-error not a WellKnownName
      produce: { chess: produceInstance },
    },
  } = permittedPowers;

  const installation = await orcaInstallation;

  const storageNode = await E(chainStorage).makeChildNode('chess');
  const marshaller = await E(board).getPublishingMarshaller();

  const { chainDetails: nameToInfo = chainDetails } =
    config.options[contractName];

  /** @type {StartUpgradableOpts<ContractStartFunction & OrcaSF>} **/
  const startOpts = {
    label: 'chess',
    installation,
    terms: { chainDetails: nameToInfo },
    privateArgs: {
      localchain: await localchain,
      orchestrationService: await cosmosInterchainService,
      storageNode,
      timerService: await chainTimerService,
      agoricNames: await agoricNames,
      marshaller,
    },
  };

  trace('startOpts', startOpts);
  const { instance } = await E(startUpgradable)(startOpts);

  trace(contractName, '(re)started WITH RESET');
  produceInstance.reset();
  produceInstance.resolve(instance);
};

/** @type {BootstrapManifest} */
const chessManifest = {
  [startChessContract.name]: {
    consume: {
      agoricNames: true,
      board: true,
      chainStorage: true,
      startUpgradable: true,
      zoe: true,
      localchain: true,
      chainTimerService: true,
      cosmosInterchainService: true,
    },
    installation: {
      produce: { chess: true },
      consume: { chess: true },
    },
    instance: {
      produce: { chess: true },
    },
  },
};
harden(chessManifest);

export const getManifestForChess = (
  { restoreRef },
  { installKeys, chainDetails },
) => {
  trace('getManifestForChess', installKeys);
  return harden({
    manifest: chessManifest,
    installations: {
      [contractName]: restoreRef(installKeys[contractName]),
    },
    options: {
      [contractName]: { chainDetails },
    },
  });
};

export const permit = harden({
  consume: {
    agoricNames: true,
    board: true,
    chainStorage: true,
    startUpgradable: true,
    zoe: true,
    localchain: true,
    chainTimerService: true,
    cosmosInterchainService: true,
  },
  installation: {
    consume: { chess: true },
    produce: { chess: true },
  },
  instance: { produce: { chess: true } },
  brand: { consume: { BLD: true, IST: true }, produce: {} },
  issuer: { consume: { BLD: true, IST: true }, produce: {} },
});

export const main = startChessContract;
