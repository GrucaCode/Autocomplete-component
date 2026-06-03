import { useEffect, useRef, useState } from 'react';
import SuggestionsDropdown from './SuggestionsDropdown';

function Autocomplete() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideInputClick = (event: MouseEvent) => {
      if(
        autocompleteRef.current && 
        !autocompleteRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideInputClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideInputClick);
    }
  }, []);

  const handleInputFocus = () => {
    setIsDropdownOpen(true)
  }

  const handleInputChange = () => {

  }

  return (
    <div ref={autocompleteRef} className="relative bg-gray-300 flex flex-col min-w-[100px] w-3/4 max-w-[600px] rounded-sm px-10 py-10" >
      <h2 className="pb-5">Choose options:</h2>
      <div>
        <input type="text" onFocus = {handleInputFocus} onChange={handleInputChange} className="bg-white rounded-sm w-full mb-2 px-5 py-2"/>
      </div>
      {isDropdownOpen && <SuggestionsDropdown />}
    </div>
  )
}

export default Autocomplete