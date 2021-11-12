import React from 'react';
import './App.css';

const cardList1 = [
  '-ane',
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

function DrawCards({ cardList }) {
  let usedNumbers = [];
  let team1Cards = [];
  let team2Cards = [];
  let i=0;
  while (i<3) {
    let cardIndex = Math.floor(Math.random()*(cardList.length-1));
    console.log(cardIndex);
    if (!usedNumbers.includes(cardIndex)) {
      usedNumbers.push(cardIndex);
      team1Cards.push(cardList[cardIndex]);
      i=i+1;
    };
  };
  let j=0;
  while (j<3) {
    let cardIndex = Math.floor(Math.random()*(cardList.length-1));
    if (!usedNumbers.includes(cardIndex)) {
      usedNumbers.push(cardIndex);
      team2Cards.push(cardList[cardIndex]);
      j=j+1;
    };
  };
  console.log(cardList);
  console.log('team1 cards', team1Cards);
  console.log('team2 cards', team2Cards);
  return (
    <div>
      <p>Team 1 Cards: <ul>{team1Cards.map(card => <li>{card}</li>)}</ul></p>
      <p>Team 2 Cards: <ul>{team2Cards.map(card => <li>{card}</li>)}</ul></p>
    </div>
  )
}

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

function RandomButton({ text }) {
  const onClick = (event) => {
    console.log('clicked');
  }
  return (
    <button onClick={onClick}>{text}</button>
  )
}

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
        <DrawCards cardList={cardList1} />
        <RandomButton text={`Undo last`} />
        <ClearBoard />
        <ul>
        {lineStructure.map((bond, index) => (
          <DisplayInATable key={index} arrayElement={bond} />
        ))}
        </ul>
        <RandomButton text={`Click Me I Don't Do Anything`}/>
      </div>
    </div>

  );
}

export default App;
