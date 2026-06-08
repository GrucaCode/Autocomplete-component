import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type ChosenTileProps = {
    textTile: string,
    onRemove: ()=>void
}

function ChosenTile({textTile, onRemove}: ChosenTileProps) {
    return (
        <div className="flex flex-row gap-2 bg-orange-300 rounded-md px-4 py-2">
            <button onClick={onRemove} className="cursor-pointer">
                <FontAwesomeIcon icon={faXmark} />
            </button>
            <p>{textTile}</p>
        </div>
    );
}

export default ChosenTile;