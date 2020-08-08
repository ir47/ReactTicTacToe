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
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
  }

  render() {
    return (
      <div>
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
    constructor(props) {
        super(props);
        this.state = {
            history : [{
                squares : Array(9).fill(null),
            }],
            stepNumber : 0,
            xIsNext : true,
        };
    }
    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history : history.concat([{
                squares : squares,
            }]),
            stepNumber : history.length,
            xIsNext : !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber : step,
            xIsNext : (step % 2) === 0,
        });
    }

  render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const state = getGameStatus(current.squares);

      let moves = history.map((step, move) => {
        const desc = move ?
            'Go to move #' + move :
            'Go to game start';
        return (
                <li key={move}>
                    <button onClick = {() => this.jumpTo(move)}>{desc}</button>
                </li>
        );
      });


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
      <div className="game">
        <div className="game-board">
            <Board
                squares = {current.squares}
                onClick = {(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
        <div>{status}</div>
          <ol>{moves}</ol>
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
