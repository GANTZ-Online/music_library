import './App.css';
import { useState, Suspense, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArtistView from './components/ArtistView';
import AlbumView from './components/AlbumView';
import Gallery from './components/Gallery';
import SearchBar from './components/SearchBar';
import Spinner from './components/Spinner';
import { DataContext } from './context/DataContext';
import { SearchContext } from './context/SearchContext';
import { createResource as fetchData } from './helper';

const App = () => {
  let searchInput = useRef('');
  let [data, setData] = useState(null);
  let [message, setMessage] = useState('Search for Music!');

  const handleSearch = (e, term) => {
    e.preventDefault();
    setData(fetchData(term, 'main'));
    setMessage(`Results for "${term}"`);
  };

  const renderGallery = () => {
    if (data) {
      return (
        <Suspense fallback={<Spinner />}>
          <Gallery />
        </Suspense>
      );
    }
  };

  return (
    <div className="App">
      {message}
      <Router>
        <Routes>
          <Route exact path="/" element={
            <>
              <SearchContext.Provider value={{ term: searchInput, handleSearch: handleSearch }}>
                <SearchBar />
              </SearchContext.Provider>
              <DataContext.Provider value={data}>
                {renderGallery()}
              </DataContext.Provider>
            </>
          } />
          <Route path="/album/:id" element={<AlbumView />} />
          <Route path="/artist/:id" element={<ArtistView />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;