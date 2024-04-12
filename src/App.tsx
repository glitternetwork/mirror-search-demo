// App.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const [isLoading] = useState(false);

  const searchHandle = () => {
    navigate(`/search/${query}`)
  }

  return (
    <div className="search-container">
      <h1 className="website-title text-center my-4">Mirror Search
      </h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search for anything"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              searchHandle();
            }
          }}
        />
        <div className="input-group-append">
          <button className="btn btn-primary" onClick={searchHandle} disabled={isLoading}>
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span className="sr-only">Loading...</span>
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </div>

    </div>
  );
}

export default App;
