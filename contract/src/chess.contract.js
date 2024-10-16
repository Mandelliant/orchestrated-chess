import { E } from '@agoric/eventual-send';
import { makeNotifierKit } from '@agoric/notifier';
import { AmountShape } from '@agoric/ertp';
import { makeTracer } from '@agoric/internal';
import { withOrchestration } from '@agoric/orchestration/src/utils/start-helper.js';
import { ChainInfoShape } from '@agoric/orchestration/src/typeGuards.js';
import { InvitationShape } from '@agoric/zoe/src/typeGuards.js';
import { M } from '@endo/patterns';
import * as flows from './chess.flows.js';

export const startChess = (zcf) => {
  // Initialize the game state
  // let currentBoard = createInitialBoard(); // Define this function as needed
  // let playerTurn = 'white';
  // const players = {
  //   white: null,
  //   black: null,
  // };

  // Create a notifier to update players about the game state
  // const { notifier, updater } = makeNotifierKit({
  //   board: currentBoard,
  //   turn: playerTurn,
  // });

  // // Function to register a player
  // const registerPlayer = (seat, color) => {
  //   if (players[color]) {
  //     seat.fail(new Error(`${color} player is already registered.`));
  //     return;
  //   }
  //   players[color] = seat;
  //   seat.exit();
  //   return `Registered as ${color} player.`;
  // };

  // Function to handle player moves
  // const makeMoveHandler = (seat, { startPos, endPos }) => {
  //   const color = Object.keys(players).find((key) => players[key] === seat);
  //   if (!color) {
  //     seat.fail(new Error('Player not registered.'));
  //     return;
  //   }
  //   if (playerTurn !== color) {
  //     seat.fail(new Error('Not your turn!'));
  //     return;
  //   }

  //   // Handle the move logic
  //   const moveSuccessful = movePiece(currentBoard, startPos, endPos); // Define this function
  //   if (!moveSuccessful) {
  //     seat.fail(new Error('Invalid move.'));
  //     return;
  //   }

    // Update the game state
  //   playerTurn = playerTurn === 'white' ? 'black' : 'white';
  //   updater.updateState({
  //     board: currentBoard,
  //     turn: playerTurn,
  //   });

  //   seat.exit();
  //   return 'Move successful.';
  // };

  // @ts-expect-error XXX ZCFSeat not Passable
  const { doMove } = orchestrateAll(flows, {
   
  });

  // Public methods exposed to users
  const publicFacet = zone.exo(
    'Chess Public Facet',
    M.interface('Chess PF', {
      makeMoveInvitation: M.callWhen().returns(),
    }),
    {
    // Method for players to register
    // makeRegisterInvitation: (color) => {
    //   if (!['white', 'black'].includes(color)) {
    //     throw new Error('Invalid color. Choose "white" or "black".');
    //   }
    //   return zcf.makeInvitation(
    //     (seat) => registerPlayer(seat, color),
    //     `Register as ${color} player`
    //   );
    // },

    // Method to get a notifier for game state updates
    // getGameNotifier: () => notifier,

    // Method to make a move
    makeMoveInvitation: () => {
      // return zcf.makeInvitation(
      //   (seat) => makeMoveHandler(seat, { startPos, endPos }),
      //   'Make a move'
      // );
      return zcf.makeInvitation(doMove, 'Perform chess move');
    },
  };

  return harden({ publicFacet });
};

export const start = withOrchestration(contract);
harden(start);