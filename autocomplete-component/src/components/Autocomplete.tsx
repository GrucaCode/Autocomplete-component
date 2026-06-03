import { useEffect, useRef, useState } from 'react';
import SuggestionsDropdown from './SuggestionsDropdown';

type AutocompleteProps<T> = {
    suggestions: T[];
    getSuggestionLabel: (suggestion: T) => string;
    getSuggestionId: (suggestion: T) => string;
};

function Autocomplete<T>({ suggestions, getSuggestionLabel, getSuggestionId }: AutocompleteProps<T>) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [query, setQuery] = useState('');
    const autocompleteRef = useRef < HTMLDivElement | null > (null);

    useEffect(() => {
        const handleOutsideInputClick = (event: MouseEvent) => {
            if (
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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setQuery(value);
    }

    const filteredSuggestions =
      query === ""
        ? suggestions
        : suggestions.filter((suggestion) =>
        getSuggestionLabel(suggestion)
          .toLowerCase()
          .includes(query.toLowerCase())
    );

    return (
        <div ref={autocompleteRef} className="relative bg-gray-300 flex flex-col min-w-[100px] w-3/4 max-w-[600px] rounded-sm px-10 py-10" >
            <h2 className="pb-5">Choose options:</h2>
            <div>
                <input type="text" value={query} placeholder="Write here" onFocus={handleInputFocus} onChange={handleInputChange} className="bg-white rounded-sm w-full mb-2 px-5 py-2" />
            </div>
            {isDropdownOpen && (
              <SuggestionsDropdown 
                suggestions={filteredSuggestions}
                getSuggestionLabel={getSuggestionLabel}
                getSuggestionId={getSuggestionId}
              />
            )}
        </div>
    )
}

export default Autocomplete