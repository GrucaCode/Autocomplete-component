import { useEffect, useRef, useState } from 'react';
import SuggestionsDropdown from './SuggestionsDropdown';
import ChosenTile from './ChosenTile';

type AutocompleteProps<T> = {
    suggestions: T[];
    getSuggestionLabel: (suggestion: T) => string;
    getSuggestionId: (suggestion: T) => string;
};

function Autocomplete<T>({ suggestions, getSuggestionLabel, getSuggestionId }: AutocompleteProps<T>) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedSuggestions, setSelectedSuggestions] = useState<T[]>([]);

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
      setIsDropdownOpen(true);
    }

    const selectedSuggestionIds = selectedSuggestions.map((suggestion) => 
        getSuggestionId(suggestion)
    );

    const handleSelect = (suggestion: T) => {
        const suggestionId = getSuggestionId(suggestion);
        const isAlreadySelected = selectedSuggestionIds.includes(suggestionId);

        if(isAlreadySelected) {
            return;
        }

        setSelectedSuggestions((previousSelectedSuggestions) => [
            ...previousSelectedSuggestions,
            suggestion
        ]);

        setQuery("");
        setIsDropdownOpen(false);
    }

    const handleRemove = (suggestion: T) => {
        const suggestionId = getSuggestionId(suggestion);
        setSelectedSuggestions((previousSelectedSuggestions) =>
            previousSelectedSuggestions.filter(
                (selectedSuggestion) =>
                    getSuggestionId(selectedSuggestion) !== suggestionId
            )
        );
    };

    const filteredSuggestions =
      query === ""
        ? suggestions
        : suggestions.filter((suggestion) =>
        getSuggestionLabel(suggestion)
          .toLowerCase()
          .includes(query.toLowerCase())
    );

    return (
        <div
            ref={autocompleteRef} 
            className="relative bg-gray-700 flex flex-col min-w-[100px] w-3/4 max-w-[600px] rounded-sm px-10 py-10"
        >
            <h2 className="pb-5 text-white">Choose options:</h2>
            <div className="w-full min-h-15 bg-gray-600 flex gap-2 flex-wrap items-center">
                {selectedSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {selectedSuggestions.map((suggestion) => (
                            <ChosenTile
                                textTile={getSuggestionLabel(suggestion)}
                                onRemove={() => handleRemove(suggestion)}
                            />
                        ))}
                    </div>
                )}
                <input 
                    type="text"
                    value={query} 
                    placeholder="Write here"
                    onFocus={handleInputFocus} 
                    onChange={handleInputChange} 
                    className="rounded-sm flex grow px-5 py-2"
                />
            </div>
            {isDropdownOpen && (
              <SuggestionsDropdown 
                suggestions={filteredSuggestions}
                getSuggestionLabel={getSuggestionLabel}
                getSuggestionId={getSuggestionId}
                selectedSuggestionIds={selectedSuggestionIds}
                onSelect={handleSelect}
              />
            )}
        </div>
    )
}

export default Autocomplete