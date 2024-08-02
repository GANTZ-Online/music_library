import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

const AlbumView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [albumData, setAlbumData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlbumData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/song/${id}`); // Updated endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const resData = await response.json();
                setAlbumData(resData.results);
            } catch (error) {
                console.error('Error fetching album data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAlbumData();
    }, [id]);

    const navButtons = () => (
        <div>
            <button onClick={() => navigate(-1)}>Back</button>
            |
            <button onClick={() => navigate('/')}>Home</button>
        </div>
    );

    const renderSongs = () => (
        albumData.filter(entity => entity.kind === 'song').map((song, i) => (
            <div key={i}>
                {song.trackName}
            </div>
        ))
    );

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {albumData.length > 0 ? <h2>{albumData[0].collectionName}</h2> : <div>No album data found</div>}
            {navButtons()}
            {renderSongs()}
        </div>
    );
};

export default AlbumView;