import React from 'react';
import './App.css';

const cardList1 = [
  '-ane',
  '-ene',
  '-yne',
  'prop-',
  'but-',
  'pent-',
  'hex-',
  'hep-',
  'oct-',
  'non-',
  'dec-',
  'methyl-',
  'ethyl-',
  'propyl-',
  'dimethyl-',
  '1-',
  '2-',
  '3-',
  'chloro-',
  'bromo-'
]

function Bond({ bond, atoms }) {
  let fromAtom, toAtom;
  atoms.forEach((atom) => {
    if (atom.id == bond.fromId) {
      fromAtom = atom
    }
    if (atom.id == bond.toId) {
      toAtom = atom
    }
  })

  return <path
    d={`M ${fromAtom.x} ${fromAtom.y} L ${toAtom.x} ${toAtom.y}`}
    stroke="black"
    strokeWidth="12"
  />
}

// sigh

function ShowOrHide(props) {
  if (props.shown) {
    console.log(props.shown);
    return (
      <ul>
        <li>{props.hand[0]}</li>
        <li>{props.hand[1]}</li>
        <li>{props.hand[2]}</li>
      </ul>
    );
  }
  return (
    <ul>
      <li>###</li>
      <li>###</li>
      <li>###</li>
    </ul>
  );
}

class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.handleShowClick = this.handleShowClick.bind(this);
    this.handleDrawClick = this.handleDrawClick.bind(this);
    this.state = {
      drawnCards: [0,0,0],
      deck: this.props.deck,
      isShown: false
    }
  }
  handleShowClick() {
    console.log('clicked showClicked')
    this.setState(prevState => ({
      isShown: !prevState.isShown
    }));
  }
  handleDrawClick() {
    console.log('clicked drawClick')
    this.drawTeamCards();
  }

  drawTeamCards() {
    let drawn = [];
    let usedNumbers = [];
    let i=0;
    while (i<3) {
      let cardIndex = Math.floor(Math.random()*(this.props.deck.length-1));
      if (!usedNumbers.includes(cardIndex)) {
        usedNumbers.push(cardIndex);
        drawn.push(this.props.deck[cardIndex])
        console.log(drawn);
        i=i+1;
      };
    };
    console.log(drawn);
    this.setState({drawnCards: drawn
    });
  }

  render () {
    return (
      <div>
        <ShowOrHide shown={this.state.isShown} hand={this.state.drawnCards} />
        <button onClick={this.handleShowClick}>
          {this.state.isShown ? 'Hide' : 'Show'}
        </button>
        <button onClick={this.handleDrawClick}>
          Draw Cards
        </button>
      </div>
    )
  }
}



  // return (
  //   <div>
  //     <p>Team 1 Cards: <ul>{hand.map(card => <li>{card}</li>)}</ul></p>
  //     <button onClick={onClick}>Draw Cards</button>
  //   </div>
  // )

// what a mess

// {cardList1.map((card, index) => (
//   <DisplayInATable key={index} arrayElement={card} />
// ))}





// class ShowHandButton extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {isShown: false};
//     this.handleClick = this.handleClick.bind(this);
//   }

//   handleClick() {
//     this.setState(prevState => ({
//       isShown: !prevState.isShown
//     }));
//   }

//   render() {
//     return (
//       <div>
//         <ShowOrHide shown={this.state.isShown} text={[1,2,3]}/>
//         <button onClick={() => this.handleClick()}>
//           {this.state.isShown ? 'Hide' : 'Show'}
//         </button>
//       </div>
//     )
//   }
// }

function ClearBoard() {
  const onClick = (event) => {
    clearNow()
  }
  return <button onClick={onClick}>Clear</button>
}

function DisplayInATable({ arrayElement }) {
  return (
    <li>{arrayElement}</li>
  )
}

function Atom({ atom, isSelected, onSelect }) {
  const onMouseDown = (event) => {
    onSelect()
  }
  return <g onMouseDown={onMouseDown}>
    <circle cx={atom.x} cy={atom.y} r="10" fill={isSelected ? "red" : "black"}/>
    <text x={atom.x - 3} y={atom.y + 3} fill="white">{atom.id}</text>
  </g>
}

function App() {
  const [atoms, setAtoms] = React.useState([
    { x: 100, y: 200, id: 1 }
  ]);
  const [bonds, setBonds] = React.useState([])
  const [atomsNumber, setAtomsNumber] = React.useState(1);
  const [lineStructure, setLineStructure] = React.useState([])
  const [selectedAtomId, setSelectedAtomId] = React.useState(undefined);
  const [nextId, setNextId] = React.useState(2);


  const onMouseUp = (event) => {
    setAtoms([
      ...atoms,
      {
        x: (event.clientX - 20), // this correction depends on values in CSS
        y: (event.clientY - 140), // figure out how to tie these together
        id: nextId
      }
    ])
    setNextId(nextId + 1)
    setAtomsNumber(atomsNumber + 1)

    if (selectedAtomId) {
      setBonds([
        ...bonds,
        {
          fromId: selectedAtomId,
          toId: nextId
        }
      ])

    }

    setSelectedAtomId(undefined)
    console.log(lineStructure)
    console.log(event)
  }

  // so like, this is really weird, right?
  // why does this have to try so many times?
  if (lineStructure.length < bonds.length) {
    bonds.map((drawnBond) => {
    setLineStructure([
      ...lineStructure,
      `C${drawnBond.fromId}-C${drawnBond.toId}`
    ])
    console.log('did a map');
    console.log(lineStructure.length);
  })
  }

  console.log(lineStructure);
  console.log('I see the cardlist in here ',cardList1);

  // why do I need an empty event here...?
  const onMouseDown = (event) => {
  }

  return (
    <div >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${window.width} ${window.height}`}
        className="board"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        {
          bonds.map((bond, index) => (
            <Bond
              key={index}
              bond={bond}
              atoms={atoms}
            />
          ))
        }
        {
          atoms.map((atom, index) => {
            const onSelect = () => setSelectedAtomId(atom.id)
            return <Atom
              atom={atom}
              isSelected={selectedAtomId == atom.id}
              onSelect={onSelect}
              key={index}
            />
          })
        }
      </svg>
      <div className="otherstuff">
        <div className="otherstuffleft">
          <p>Team 1 Hand</p>
          <Hand deck={cardList1}/>
        </div>
        <div className="otherstuffright">
          <p>Team 2 Hand</p>
          <Hand deck={cardList1}/>
        </div>
        <div>
            <h2>Bonds so far</h2>
            <ul>
            {lineStructure.map((bond, index) => (
              <DisplayInATable key={index} arrayElement={bond} />
            ))}
            </ul>
            <ClearBoard />
        </div>
      </div>
    </div>

  );
}

export default App;
