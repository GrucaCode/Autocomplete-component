import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type ChosenTileProps = {
    key: string;
    textTile: string;
    onRemove: ()=>void;
}

function ChosenTile({textTile, onRemove}: ChosenTileProps) {
    return (
        <div className="flex flex-row  items-center gap-2 px-4 py-2 text-white bg-black rounded-xl">
            <button 
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${textTile}`}
                className="flex content-center items-center text-white cursor-pointer"
            >
                <FontAwesomeIcon icon={faXmark}/>
            </button>
            <p>{textTile}</p>
        </div>
    );
}

export default ChosenTile;