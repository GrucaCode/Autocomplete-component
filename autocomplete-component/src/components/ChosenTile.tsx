import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type ChosenTileProps = {
    key: string;
    textTile: string;
    onRemove: ()=>void;
}

function ChosenTile({textTile, onRemove}: ChosenTileProps) {
    return (
        <div className="flex flex-row gap-2 items-center bg-black text-white rounded-xl px-4 py-2">
            <button 
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${textTile}`}
                className="cursor-pointer flex text-white content-center items-center"
            >
                <FontAwesomeIcon icon={faXmark}/>
            </button>
            <p>{textTile}</p>
        </div>
    );
}

export default ChosenTile;