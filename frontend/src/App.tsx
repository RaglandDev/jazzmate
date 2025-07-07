import { useState } from 'react'
import CategorySelector from './CategorySelector'

function App() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">What do you want to work on?</h1>
      <CategorySelector categories={['Rhythm', 'Melody', 'Harmony']} selected={selected} setSelected={setSelected} />
    </div>
  )
}

export default App
