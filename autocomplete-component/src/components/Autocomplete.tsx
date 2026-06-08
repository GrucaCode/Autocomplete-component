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

    const listboxId = "autocomplete-listbox";
    const inputId = "autocomplete-input";

    return (
        <div
            ref={autocompleteRef} 
            className="w-3/4 min-w-[100px] max-w-[600px] relative bg-white flex flex-col rounded-sm px-10 py-10 shadow-2xl font-montserrat"
        >
            <label htmlFor={inputId} className="pb-5 text-black font-bold text-2xl">Choose options</label>
            <div className="w-full bg-indigo-200 shadow-2xl flex gap-2 flex-wrap items-center rounded-t-sm px-2 py-2">
                {selectedSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
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
                    id={inputId}
                    type="text"
                    value={query} 
                    placeholder="Write here"
                    onFocus={handleInputFocus} 
                    onChange={handleInputChange} 
                    onKeyDown={handleInputKeyDown}
                    role="combobox"
                    aria-expanded={isDropdownOpen}
                    aria-autocomplete="list"
                    aria-activedescendant={
                        currentSuggestionIndex !== null && activeSuggestions[currentSuggestionIndex]
                            ? `suggestion-${getSuggestionId(activeSuggestions[currentSuggestionIndex])}`
                            : undefined
                        }
                    className="flex grow px-5 py-4 placeholder-black text-black"
                />
                {canCreateSuggestion && (
                    <button
                        type="button"
                        onClick={handleCreateSuggestion}
                        className="text-black rounded-xl bg-white shadow-xl/10 hover:bg-black hover:text-white py-2 px-5"
                    >
                        Add
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
                listboxId={listboxId}
              />
            )}
        </div>
    )
}

export default Autocomplete