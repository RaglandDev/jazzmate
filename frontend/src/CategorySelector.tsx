interface Props {
  selected: string | null
  setSelected: (val: string) => void
}

const categories = ['Rhythm', 'Melody', 'Harmony']

export default function CategorySelector({ selected, setSelected }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:space-x-8 space-y-4 sm:space-y-0">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelected(cat)}
          className={`
            w-32 h-32 sm:w-32 sm:h-32 rounded-full flex items-center justify-center border-4 transition-colors duration-150
            ${
              selected === cat
                ? 'bg-blue-500 text-white border-blue-700'
                : 'bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700'
            }`}
        >
          <span className="text-base sm:text-xl">{cat}</span>
        </button>
      ))}
    </div>
  )
}
