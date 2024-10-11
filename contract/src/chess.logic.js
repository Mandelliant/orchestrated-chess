// Define the chessboard as an 8x8 array with initial positions
const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ];
  
  // Variables to track en passant and castling availability
  let enPassantTarget = null;
  let castlingRights = {
    whiteKing: true,
    blackKing: true,
    whiteRookKingSide: true,
    blackRookKingSide: true,
    whiteRookQueenSide: true,
    blackRookQueenSide: true,
  };
  
  // Basic function to print the chessboard in console
  function printBoard(board) {
    board.forEach(row => console.log(row.join(' ')));
  }
  
  // Function to check if the move is within bounds
  function isInBounds(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  }
  
  // Function to check if a square is empty
  function isEmptySquare(x, y, board) {
    return board[x][y] === '';
  }
  
  // Helper function to check if two positions are occupied by opposite colors
  function isOpponentPiece(x, y, piece, board) {
    const target = board[x][y];
    return target && ((piece === piece.toUpperCase() && target === target.toLowerCase()) || 
                      (piece === piece.toLowerCase() && target === target.toUpperCase()));
  }
  
  // Main function to validate moves based on chess rules
  function isValidMove(start, end, board, piece) {
    const [sx, sy] = start;
    const [ex, ey] = end;
  
    // Basic move rules for each piece
    switch (piece.toLowerCase()) {
      case 'p': return isValidPawnMove(start, end, board, piece);
      case 'r': return isValidRookMove(start, end, board);
      case 'n': return isValidKnightMove(start, end, board);
      case 'b': return isValidBishopMove(start, end, board);
      case 'q': return isValidQueenMove(start, end, board);
      case 'k': return isValidKingMove(start, end, board, piece);
      default: return false;
    }
  }
  
  // Helper function for valid pawn move
  function isValidPawnMove(start, end, board, piece) {
    const [sx, sy] = start;
    const [ex, ey] = end;
    const direction = piece === 'P' ? -1 : 1;
    const startingRow = piece === 'P' ? 6 : 1;
  
    // Standard move: 1 square forward
    if (sy === ey && ex === sx + direction && isEmptySquare(ex, ey, board)) {
      return true;
    }
  
    // Double move on first move
    if (sy === ey && ex === sx + 2 * direction && sx === startingRow && isEmptySquare(ex, ey, board) && isEmptySquare(sx + direction, sy, board)) {
      enPassantTarget = [ex - direction, ey];  // Set en passant target
      return true;
    }
  
    // Capture move
    if (Math.abs(sy - ey) === 1 && ex === sx + direction && isOpponentPiece(ex, ey, piece, board)) {
      return true;
    }
  
    // En passant
    if (Math.abs(sy - ey) === 1 && ex === sx + direction && [ex, ey].toString() === enPassantTarget?.toString()) {
      board[enPassantTarget[0]][enPassantTarget[1]] = '';  // Capture the en passant pawn
      return true;
    }
  
    return false;
  }
  
  // Helper function for valid rook move
  function isValidRookMove(start, end, board) {
    const [sx, sy] = start;
    const [ex, ey] = end;
  
    // Ensure rook moves either in a straight line
    if (sx !== ex && sy !== ey) return false;
  
    // Check that no pieces block the path
    if (sx === ex) { // Horizontal move
      for (let y = Math.min(sy, ey) + 1; y < Math.max(sy, ey); y++) {
        if (!isEmptySquare(sx, y, board)) return false;
      }
    } else { // Vertical move
      for (let x = Math.min(sx, ex) + 1; x < Math.max(sx, ex); x++) {
        if (!isEmptySquare(x, sy, board)) return false;
      }
    }
    return true;
  }
  
  // Helper function for valid knight move
  function isValidKnightMove(start, end, board) {
    const [sx, sy] = start;
    const [ex, ey] = end;
  
    const dx = Math.abs(ex - sx);
    const dy = Math.abs(ey - sy);
  
    // L-shaped move (2 squares in one direction, 1 in the other)
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
  }
  
  // Helper function for valid bishop move
  function isValidBishopMove(start, end, board) {
    const [sx, sy] = start;
    const [ex, ey] = end;
  
    const dx = Math.abs(ex - sx);
    const dy = Math.abs(ey - sy);
  
    // Diagonal move
    if (dx !== dy) return false;
  
    // Check that no pieces block the path
    const xStep = ex > sx ? 1 : -1;
    const yStep = ey > sy ? 1 : -1;
    for (let i = 1; i < dx; i++) {
      if (!isEmptySquare(sx + i * xStep, sy + i * yStep, board)) return false;
    }
  
    return true;
  }
  
  // Helper function for valid queen move (combines rook and bishop moves)
  function isValidQueenMove(start, end, board) {
    return isValidRookMove(start, end, board) || isValidBishopMove(start, end, board);
  }
  
  // Helper function for valid king move
  function isValidKingMove(start, end, board, piece) {
    const [sx, sy] = start;
    const [ex, ey] = end;
  
    const dx = Math.abs(ex - sx);
    const dy = Math.abs(ey - sy);
  
    // Standard king move: 1 square in any direction
    if (dx <= 1 && dy <= 1) return true;
  
    // Castling (king moves two spaces towards a rook)
    if (dx === 2 && dy === 0) {
      // Check if castling is allowed (king and rook haven't moved, no pieces in between, not in check)
      if (isValidCastling(sx, sy, ex, ey, board, piece)) {
        return true;
      }
    }
  
    return false;
  }
  
  // Helper function for castling
  function isValidCastling(sx, sy, ex, ey, board, piece) {
    const isKingSide = ex > sx;
    const rookPosY = isKingSide ? 7 : 0;
    const rook = piece === 'K' ? 'R' : 'r';
  
    // Check that the castling rights are intact and no pieces are between the king and the rook
    if ((piece === 'K' && castlingRights.whiteKing && isKingSide && castlingRights.whiteRookKingSide) ||
        (piece === 'K' && castlingRights.whiteKing && !isKingSide && castlingRights.whiteRookQueenSide) ||
        (piece === 'k' && castlingRights.blackKing && isKingSide && castlingRights.blackRookKingSide) ||
        (piece === 'k' && castlingRights.blackKing && !isKingSide && castlingRights.blackRookQueenSide)) {
      
      for (let y = Math.min(sy, rookPosY) + 1; y < Math.max(sy, rookPosY); y++) {
        if (!isEmptySquare(sx, y, board)) return false;
      }
      // Perform the castling move by moving the rook next to the king
      board[sx][rookPosY] = '';  // Remove rook from original position
      board[sx][isKingSide ? ey - 1 : ey + 1] = rook;  // Place rook next to the king
      return true;
    }
    
    return false;
  }
  
  // Helper function to check if pawn promotion is needed
  function checkPawnPromotion(x, y, piece, board) {
    const isPawn = piece.toLowerCase() === 'p';
    const promotionRow = piece === 'P' ? 0 : 7;
  
    if (isPawn && x === promotionRow) {
      // Promote to a queen by default (you can extend this to allow user choice)
      board[x][y] = piece === 'P' ? 'Q' : 'q';
    }
  }
  
  // Function to move a piece
  function movePiece(start, end, board) {
    const [sx, sy] = start;
    const [ex, ey] = end;
    const piece = board[sx][sy];
  
    // Move the piece if the move is valid
    if (isValidMove(start, end, board, piece)) {
      board[ex][ey] = piece;
      board[sx][sy] = '';
      
      // Handle special cases
      checkPawnPromotion(ex, ey, piece, board);  // Check for pawn promotion
      enPassantTarget = null;  // Reset en passant target after each move
    }
  }