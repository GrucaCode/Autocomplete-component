import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ChosenTile: React.FC<{textTile: string}> = (props) => {
    return (
        <div>
            <button>
                <FontAwesomeIcon icon={faXmark} />
            </button>
            <p>{props.textTile}</p>
        </div>
    );
}

export default ChosenTile;