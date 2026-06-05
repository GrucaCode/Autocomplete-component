import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type ChosenTileProps = {
    textTile: string,
    onRemove: ()=>void
}

function ChosenTile({textTile, onRemove}: ChosenTileProps) {
    return (
        <div>
            <button onClick={onRemove}>
                <FontAwesomeIcon icon={faXmark} />
            </button>
            <p>{textTile}</p>
        </div>
    );
}

export default ChosenTile;