import { useState } from 'react'
import Xarrow, { Xwrapper } from 'react-xarrows'
import CategorySelector from './CategorySelector'

function App() {
  const [selected, setSelected] = useState<string | null>(null)
  const [selectedSub, setSelectedSub] = useState<string | null>(null)

  const getSubcats = (cat: string | null) => {
    switch (cat) {
      case 'Rhythm':
        return ['Charleston', 'Shifted Charleston', 'Mirrored Charleston']
      case 'Melody':
        return ['Scales', 'Arpeggios', 'Enclosures']
      case 'Harmony':
        return ["Shells", "Drop-2's", 'Progressions']
      default:
        return null
    }
  }

  const subcats = getSubcats(selected)

  return (
    <Xwrapper>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
        <h1 className="text-4xl font-bold mb-8">What do you want to work on?</h1>

        <CategorySelector
          prefix="main"
          categories={['Rhythm', 'Melody', 'Harmony']}
          selected={selected}
          setSelected={val => { setSelected(val); setSelectedSub(null) }}
        />

        {subcats && (
          <div className="mt-16">
            <CategorySelector
              prefix="sub"
              categories={subcats}
              selected={selectedSub}
              setSelected={setSelectedSub}
            />
          </div>
        )}

        {/* Render arrow only when both are selected */}
        {selected && selectedSub && (
          <Xarrow
            start={`main-${selected}`}
            end={`sub-${selectedSub}`}
            color="#FBBF24"
            strokeWidth={4}
            headSize={6}
            path="smooth"
            startAnchor={{ position: "bottom", offset: { x: 0 } }}
            endAnchor={{ position: "top", offset: { x: 0 } }}
            divContainerStyle={{ position: 'relative', overflow: 'visible' }} 
          />
        )}
      </div>
    </Xwrapper>
  )
}

export default App
