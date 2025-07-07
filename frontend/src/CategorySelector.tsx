interface Props {
  categories: string[]
  selected: string | null
  setSelected: (val: string) => void
  prefix: string
}

export default function CategorySelector({ categories, selected, setSelected, prefix }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {categories.map(cat => (
        <button
          id={`${prefix}-${cat}`}    /* ← add unique ID */
          key={cat}
          onClick={() => setSelected(cat)}
          className={`
            w-32 h-32 rounded-full flex items-center justify-center border-4 transition-colors duration-150
            ${selected === cat
              ? 'bg-blue-500 text-white border-blue-700'
              : 'bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700'}
          `}
        >
          <span className="text-base sm:text-xl">{cat}</span>
        </button>
      ))}
    </div>
  )
}
