interface Props {
  value: string
  onChange: (value: string) => void
}

export default function SearchBox({ value, onChange }: Props) {
  return (
    <div className="search">
      <label htmlFor="search" className="visually-hidden">
        Бараа хайх
      </label>
      <input
        id="search"
        type="search"
        value={value}
        placeholder="Бараа хайх..."
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="search-clear" aria-label="Хайлт цэвэрлэх" onClick={() => onChange('')}>
          ✕
        </button>
      )}
    </div>
  )
}
