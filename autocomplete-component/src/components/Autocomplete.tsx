import { useState } from 'react';
import SuggestionsDropdown from './SuggestionsDropdown';

function Autocomplete() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInputClick = () => {
    if (isDropdownOpen === true) {
      setIsDropdownOpen(false);
    } else if (isDropdownOpen === false) {
      setIsDropdownOpen(true);
    }
  }

  return (
    <div>
      <h2>Choose technologies</h2>
      <ul>
        <input type="text" onClick = {handleInputClick}/>
      </ul>
      {isDropdownOpen && <SuggestionsDropdown />}
    </div>

  )
}

export default Autocomplete