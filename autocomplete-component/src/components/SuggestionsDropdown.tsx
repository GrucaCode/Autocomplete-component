type SuggestionsDropdownProps<T> = {
  suggestions: T[];
  getSuggestionLabel: (suggestion: T) => string;
  getSuggestionId: (suggestion: T) => string;
};

function SuggestionsDropdown<T>({ 
    suggestions, 
    getSuggestionLabel, 
    getSuggestionId
}: SuggestionsDropdownProps<T>) {
    if (suggestions.length === 0) {
        return (
            <p className="bg-white mb-2 px-5 py-2">
                No matching options
            </p>
        );
    };
    return (
        <ul className="bg-white mb-2 px-5 py-2">
            {suggestions.map((suggestion) => (
                <li key={getSuggestionId(suggestion)}>
                    <button>{getSuggestionLabel(suggestion)}</button>
                </li>
            ))}
        </ul>
    );
}

export default SuggestionsDropdown;