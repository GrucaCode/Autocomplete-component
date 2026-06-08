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
            <p role="status" aria-live="polite" className="bg-white mb-2 px-5 py-2">
                No matching options
            </p>
        );
    };

    return (
        <ul id={listboxId} role="listbox" className="bg-white shadow-xl h-auto max-h-50 overflow-auto rounded-b-sm">
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
                                    ? "text-gray-400 cursor-not-allowed w-full text-left px-5 py-2"
                                    : isCurrent
                                        ? "hover:bg-gray-200 text-left w-full px-5 py-1 disabled:hover:bg-gray-200"
                                        : "hover:bg-gray-200 cursor-pointer text-left w-full px-5 py-1"
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