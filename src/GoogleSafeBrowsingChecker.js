import React, { useState } from 'react';
import axios from 'axios';

const GoogleSafeBrowsingChecker = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [invalidUrl, setInvalidUrl] = useState(false);

  const api_key = 'AIzaSyCCMBLhjvN940DiRAqM0Gma6wnNcLq1S6s';

  const checkWebsite = async () => {
    setInvalidUrl(false);
    setError(null);

    try {
      if (!/^https?:\/\//i.test(url)) {
        setInvalidUrl(true);
        return;
      }

      await axios.head(url);

      const response = await axios.post(
        `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${api_key}`,
        {
          client: {
            clientId: 'your-client-id',
            clientVersion: '1.0.0',
          },
          threatInfo: {
            threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url }],
          },
        }
      );

      const data = response.data;
      setResult(data);
    } catch (error) {
      console.error('Error:', error);

      if (error.response) {
        setError(error.response?.data?.error?.message || 'An error occurred.');
      } else if (error.request) {
        setError('No response received from the server. Please try again later.');
      } else {
        setError('An error occurred while processing the request. Please check your network connection.');
      }
    }
  };

  return (
    <div>
      <label>
        Enter website URL:
        <input type="text" id="websiteUrl" value={url} onChange={(e) => setUrl(e.target.value)} />
      </label>
      <button onClick={checkWebsite}>Check Website</button>

      {invalidUrl && <p style={{ color: 'red' }}>Invalid URL! Please enter a valid URL, including http:// or https://.</p>}

      {result && result.matches && (
        <div>
          <h2>Scan Result:</h2>
          <p>URL: {url}</p>
          <p>Matches: {result.matches.length}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && !result.matches && (
        <p style={{ color: 'green' }}>Safe website! The site is secure for entry.</p>
      )}

      {result && result.matches && (
        <p style={{ color: 'red' }}>Unsafe website!</p>
      )}
    </div>
  );
};

export default GoogleSafeBrowsingChecker;
