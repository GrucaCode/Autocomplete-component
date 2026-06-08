type SuggestionsDropdownProps<T> = {
    suggestions: T[];
    getSuggestionLabel: (suggestion: T) => string;
    getSuggestionId: (suggestion: T) => string;
    selectedSuggestionIds: string[];
    onSelect: (suggestion: T) => void;
    currentSuggestionId?: string | null;
    listboxId: string;
};

function SuggestionsDropdown<T>({ 
    suggestions, 
    getSuggestionLabel, 
    getSuggestionId,
    selectedSuggestionIds,
    onSelect,
    currentSuggestionId,
    listboxId
}: SuggestionsDropdownProps<T>) {

    if (suggestions.length === 0) {
        return (
            <p role="status" aria-live="polite" className="mb-2 px-5 py-2 bg-white">
                No matching options
            </p>
        );
    };

    return (
        <ul id={listboxId} role="listbox" className="h-auto max-h-50 overflow-auto bg-white rounded-b-sm shadow-xl">
            {suggestions.map((suggestion) => {
                const suggestionId = getSuggestionId(suggestion);
                const isAlreadySelected = selectedSuggestionIds.includes(suggestionId);
                const isCurrent = currentSuggestionId === suggestionId;
                
                return(
                    <li 
                        id={`suggestion-${suggestionId}`}
                        key={suggestionId}
                        role="option"
                        aria-selected={isCurrent}
                    >
                        <button 
                            type="button"
                            disabled={isAlreadySelected}
                            onClick={()=>onSelect(suggestion)}
                            className={
                                isAlreadySelected
                                    ? "w-full px-5 py-2 text-gray-400 text-left cursor-not-allowed"
                                    : isCurrent
                                        ? "w-full px-5 py-1 text-left hover:bg-gray-200 disabled:hover:bg-gray-200"
                                        : "w-full px-5 py-1 text-left hover:bg-gray-200 cursor-pointer  "
                            }
                        >
                        {getSuggestionLabel(suggestion)}</button>
                    </li>
                )
            })}
        </ul>
    );
}

export default SuggestionsDropdown;