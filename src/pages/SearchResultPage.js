import React from 'react';
import { useSearchParams } from 'react-router-dom';

function SearchResultPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    return (
        <div>
            <h1>Search Results for: {query}</h1>
            <p>Displaying results for songs, artists, albums...</p>
        </div>
    );
}

export default SearchResultPage;