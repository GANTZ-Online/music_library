import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

const ArtistView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [artistData, setArtistData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setError('No artist ID provided');
            setLoading(false);
            return;
        }

        const fetchArtistData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/album/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const resData = await response.json();
                console.log('Fetched artist data:', resData); // Log the fetched data for debugging
                setArtistData(resData.results);
            } catch (error) {
                console.error('Error fetching artist data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchArtistData();
    }, [id]);

    const navButtons = () => (
        <div>
            <button onClick={() => navigate(-1)}>Back</button>
            |
            <button onClick={() => navigate('/')}>Home</button>
        </div>
    );

    const renderAlbums = () => (
        artistData.filter(entity => entity.collectionType === 'Album').map((album, i) => (
            <div key={i}>
                <Link to={`/album/${album.collectionId}`}>
                    <p>{album.collectionName}</p>
                </Link>
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
            {artistData.length > 0 ? <h2>{artistData[0].artistName}</h2> : <div>No artist data found</div>}
            {navButtons()}
            {renderAlbums()}
        </div>
    );
};

export default ArtistView;