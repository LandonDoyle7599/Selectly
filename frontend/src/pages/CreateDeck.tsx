import React, {FC} from 'react'
import { useNavigate } from 'react-router';

export const CreateDeck: FC = () => {
    const navigate = useNavigate()

    return(
        <div>
            <h1>CreateDeck</h1>
            <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
        </div>
    );
};