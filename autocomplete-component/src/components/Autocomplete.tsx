import { useEffect, useRef, useState } from 'react';
import SuggestionsDropdown from './SuggestionsDropdown';
import ChosenTile from './ChosenTile';

type AutocompleteProps<T> = {
    suggestions: T[];
    getSuggestionLabel: (suggestion: T) => string;
    getSuggestionId: (suggestion: T) => string;
    createSuggestion?: (query: string) => T;
};

function Autocomplete<T>({ suggestions, getSuggestionLabel, getSuggestionId, createSuggestion }: AutocompleteProps<T>) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedSuggestions, setSelectedSuggestions] = useState<T[]>([]);
    const [customSuggestions, setCustomSuggestions] = useState<T[]>([]);
    const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState<number | null>(null);

    const autocompleteRef = useRef<HTMLDivElement | null>(null);

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
      setCurrentSuggestionIndex(null);
    }

    const allSuggestions = [...suggestions, ...customSuggestions]

    const selectedSuggestionIds = selectedSuggestions.map((suggestion) => 
        getSuggestionId(suggestion)
    );

    const cleanedQuery = query.trim().toLowerCase();

    const isQueryAlreadyInSuggestions = allSuggestions.some(
        (suggestion) => 
            getSuggestionLabel(suggestion).toLowerCase() === cleanedQuery
    )

    const isQueryAlreadySelected = selectedSuggestions.some(
        (suggestion) => 
            getSuggestionLabel(suggestion).toLowerCase() === cleanedQuery
    )

    const filteredSuggestions =
      cleanedQuery === ""
        ? allSuggestions
        : allSuggestions.filter((suggestion) =>
        getSuggestionLabel(suggestion)
          .toLowerCase()
          .includes(cleanedQuery)
    );

    const activeSuggestions = filteredSuggestions.filter((suggestion) => {
        const suggestionId = getSuggestionId(suggestion);

        return !selectedSuggestionIds.includes(suggestionId);
    });

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(activeSuggestions.length === 0) {
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();

            setCurrentSuggestionIndex((previousIndex) => {
                if (previousIndex === null) {
                    return 0;
                }

                return previousIndex === activeSuggestions.length - 1
                    ? 0
                    : previousIndex + 1;
            });

            return;
        }
        
        if (event.key === "ArrowUp") {
        event.preventDefault();

            if (activeSuggestions.length === 0) {
                return;
            }

            setCurrentSuggestionIndex((previousIndex) => {
                if (previousIndex === null) {
                return activeSuggestions.length - 1;
                }

                return previousIndex === 0
                ? activeSuggestions.length - 1
                : previousIndex - 1;
            });

            return;
        }

        if(event.key === "Escape") {
            setIsDropdownOpen(false);
        }
    }

    const canCreateSuggestion = 
        Boolean(createSuggestion) &&
        cleanedQuery !== "" &&
        filteredSuggestions.length === 0 &&
        !isQueryAlreadyInSuggestions &&
        !isQueryAlreadySelected;

    const handleCreateSuggestion = () => {
        if (!createSuggestion || !canCreateSuggestion) {
            return;
        }

        const newSuggestion = createSuggestion(query.trim());
        const newSuggestionId = getSuggestionId(newSuggestion);

        const isAlreadySelected = selectedSuggestions.some(
            (suggestion) => getSuggestionId(suggestion) === newSuggestionId
        )

        const alreadyExistsInSuggestions = allSuggestions.some(
            (suggestion) => getSuggestionId(suggestion) === newSuggestionId
        )

        if(!alreadyExistsInSuggestions) {
            setCustomSuggestions((previousCustomSuggestions) => [
                ...previousCustomSuggestions,
                newSuggestion
            ]);
        }

        if(!isAlreadySelected) {
            setSelectedSuggestions((previousSelectedSuggestions) => [
                ...previousSelectedSuggestions,
                newSuggestion
            ])
        }

        setQuery("");
        setIsDropdownOpen(false);
        setCurrentSuggestionIndex(null);
        
    }

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
        setCurrentSuggestionIndex(null);
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

    return (
        <div
            ref={autocompleteRef} 
            className="relative bg-gray-700 flex flex-col min-w-[100px] w-3/4 max-w-[600px] rounded-sm px-10 py-10 shadow-2xl font-montserrat"
        >
            <h2 className="pb-5 text-white font-bold text-2xl">Choose options:</h2>
            <div className="w-full bg-gray-600 flex gap-2 flex-wrap items-center rounded-t-sm">
                {selectedSuggestions.length > 0 && (
                    <div className="flex flex-wrap">
                        {selectedSuggestions.map((suggestion) => (
                            <ChosenTile
                                key={getSuggestionId(suggestion)}
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
                    onKeyDown={handleInputKeyDown}
                    className="flex grow px-5 py-4 placeholder-gray-300 text-white"
                />
                {canCreateSuggestion && (
                    <button
                        type="button"
                        onClick={handleCreateSuggestion}
                        className="text-black rounded-md bg-green-700 py-2 px-5 mr-2"
                    >
                        ADD
                    </button>
                )}
            </div>
            {isDropdownOpen && (
              <SuggestionsDropdown 
                suggestions={filteredSuggestions}
                getSuggestionLabel={getSuggestionLabel}
                getSuggestionId={getSuggestionId}
                selectedSuggestionIds={selectedSuggestionIds}
                onSelect={handleSelect}
                currentSuggestionId={
                    currentSuggestionIndex !== null && activeSuggestions[currentSuggestionIndex]
                        ? getSuggestionId(activeSuggestions[currentSuggestionIndex])
                        : null
                }
              />
            )}
        </div>
    )
}

export default Autocomplete