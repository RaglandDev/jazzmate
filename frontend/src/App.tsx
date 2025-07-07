import { useState } from 'react'
import CategorySelector from './CategorySelector'

function App() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">Choose a Category</h1>
      <CategorySelector selected={selected} setSelected={setSelected} />

      <div className="mt-10 h-10">
        {selected && (
          <p className="text-2xl">
            You selected: <strong className="text-blue-400">{selected}</strong>
          </p>
        )}
      </div>
    </div>
  )
}

export default App
