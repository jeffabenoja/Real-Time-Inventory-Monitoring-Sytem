import React from "react"
import { CiSearch } from "react-icons/ci"

// Define the types for the props
interface SearchProps {
  columnFilter: string
  setColumnFilter: (value: string) => void
}

const Search: React.FC<SearchProps> = ({ columnFilter, setColumnFilter }) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColumnFilter(e.target.value)
  }

  return (
    <div className='relative'>
      <input
        type='text'
        className='text-sm md:text-base w-[100px] md:w-full px-3 py-1 outline-none placeholder:text-sm border border-gray-300 rounded-md focus:bg-gray-50'
        placeholder='Search...'
        value={columnFilter ?? ""}
        onChange={handleSearch}
      />
      <CiSearch
        className='absolute top-[4px] md:top-[6px] right-2 md:right-3'
        size={20}
      />
    </div>
  )
}

export default Search
