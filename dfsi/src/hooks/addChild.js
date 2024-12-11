import { useState } from "react";

export const useAddChild = () => {
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState(null);

    const addChild = async (name, school, age, parent_id) => {
        try {
            setIsPosting(true);
            const url = `${process.env.REACT_APP_SERVER_HOSTNAME}/children/add`;

            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({ name, school, age, parent_id }),
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            setIsPosting(false);
            if (!response.ok) throw new Error(data.message || 'Failed to add child');
            return response;
        } catch (err) {
            setIsPosting(false);
            setError(err);
            throw err;
        }
    };

    return { addChild, isPosting, error };
}