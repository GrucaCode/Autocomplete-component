type SuggestionsDropdownProps<T> = {
    suggestions: T[];
    getSuggestionLabel: (suggestion: T) => string;
    getSuggestionId: (suggestion: T) => string;
    selectedSuggestionIds: string[];
    onSelect: (suggestion: T) => void;
};

function SuggestionsDropdown<T>({ 
    suggestions, 
    getSuggestionLabel, 
    getSuggestionId,
    selectedSuggestionIds,
    onSelect
}: SuggestionsDropdownProps<T>) {

    if (suggestions.length === 0) {
        return (
            <p className="bg-white mb-2 px-5 py-2">
                No matching options
            </p>
        );
    };

    return (
        <ul className="bg-white h-auto max-h-50 overflow-auto">
            {suggestions.map((suggestion) => {
                const suggestionId = getSuggestionId(suggestion);
                const isAlreadySelected = selectedSuggestionIds.includes(suggestionId);
                
                return(
                    <li key={suggestionId}>
                        <button 
                            type="button"
                            disabled={isAlreadySelected}
                            onClick={()=>onSelect(suggestion)}
                            className={isAlreadySelected
                                ? "text-gray-400 cursor-not-allowed w-full text-left px-5 py-2"
                                : "hover:bg-orange-100 cursor-pointer text-left w-full px-5 py-1"
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