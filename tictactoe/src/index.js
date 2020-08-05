import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const State = {
  XWINNER : 1,
  OWINNER : 2,
  DRAW : 3,
  ONGOING : 4
}


function Square(props){
    return (
        <button className="square" onClick={props.onClick}>
     {props.value}
     </button>
    );
}

class Board extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
        squares: Array(9).fill(null),
        xIsNext: true,
    };
}
    handleClick(i){
        const squares = this.state.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }
    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
  }

  render() {
        let state = getGameStatus(this.state.squares);
        let status;
        switch (state) {
            case State.XWINNER:
                status = "X is the winner!";
                break;
            case State.OWINNER:
                status = "O is the winner!";
                break;
            case State.DRAW:
                status = "The game is a draw!";
                break;
            case State.ONGOING:
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
                break;
            default:
                status = 'Oops there was an issue!'
        }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
            <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function checkSquareValue(square){
    return square === 'X' || square === 'O';
}

function getGameStatus(squares){
    let gameStatus = calculateWinner(squares);
    if (gameStatus === State.XWINNER || gameStatus === State.OWINNER) {
        return gameStatus;
    }

    gameStatus = calculateDraw(squares);
    if (gameStatus === State.DRAW) {
        return gameStatus;
    }
    return State.ONGOING;
}

function calculateDraw(squares){
    if (squares.every(checkSquareValue)) {
        return State.DRAW;
    }
    return State.ONGOING;
}

function changeToWinnerState(square){
    if (square === 'X') {
        return State.XWINNER;
    } else if (square === 'O') {
        return State.OWINNER;
    }
    return null;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        let t = changeToWinnerState(squares[a]);
        console.log('Value in calculate winner: ' + t);
        return t;
    }
  }
  return null;
}
