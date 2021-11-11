import React from 'react';
import './App.css';

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

function Atom({ atom, isSelected, onSelect }) {
  const onMouseDown = (event) => {
    onSelect()
  }
  return <g onMouseDown={onMouseDown}>
    <circle cx={atom.x} cy={atom.y} r="10" fill={isSelected ? "red" : "black"}/>
  </g>
}

function App() {
  const [atoms, setAtoms] = React.useState([
    { x: 300, y: 200, id: 1 }
  ]);
  const [bonds, setBonds] = React.useState([])
  const [selectedAtomId, setSelectedAtomId] = React.useState(undefined);
  const [nextId, setNextId] = React.useState(2);

  const onMouseUp = (event) => {
    setAtoms([
      ...atoms,
      {
        x: event.clientX,
        y: event.clientY,
        id: nextId
      }
    ])
    setNextId(nextId + 1)

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
  }

  const onMouseDown = (event) => {
  }


  return (
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
  );
}

export default App;
