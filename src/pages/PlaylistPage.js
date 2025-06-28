import React from 'react';
import { useParams } from 'react-router-dom';

function PlaylistPage() {
    const { id } = useParams();

    return (
        <div>
            <h1>Playlist: {id}</h1>
            <p>Here you’ll see the list of songs in this playlist.</p>
            {/* List of tracks will be shown here */}
        </div>
    );
}

export default PlaylistPage;
