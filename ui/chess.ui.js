import { E } from '@agoric/eventual-send';
import { boardState, currentTurn } from './contractInstance'; // Your contract instance

const ChessGame = () => {
  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState('');

  useEffect(() => {
    // Fetch initial state from contract
    const loadState = async () => {
      const initialBoard = await E(boardState).getBoard();
      const initialTurn = await E(currentTurn).getTurn();
      setBoard(initialBoard);
      setTurn(initialTurn);
    };
    loadState();
  }, []);

  const handleMove = async (start, end) => {
    await E(boardState).makeMove(start, end);
    const newBoard = await E(boardState).getBoard();
    const newTurn = await E(currentTurn).getTurn();
    setBoard(newBoard);
    setTurn(newTurn);
  };

  return (
    <div>
      <h2>Chess Game</h2>
      <ChessBoard board={board} onMove={handleMove} />
      <p>Current Turn: {turn}</p>
    </div>
  );
};

export default ChessGame;