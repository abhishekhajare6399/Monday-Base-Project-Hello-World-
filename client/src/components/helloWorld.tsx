import { useState, useEffect } from 'react';
import { getHelloWorld } from '../apiController/controller';
import { type MondayUser } from '../constants/mondayCosntant';

const HelloWorld = () => {
  const [message, setMessage] = useState<string>('');
  const [mondayUser, setMondayUser] = useState<MondayUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getHelloWorld();
        setMessage(response.message);
        setMondayUser(response.mondayUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch message');
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>{message}</h1>
      {mondayUser && (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Monday.com User Details</h2>
          <div style={{ marginTop: '15px' }}>
            <p><strong>Name:</strong> {mondayUser.name}</p>
            <p><strong>Email:</strong> {mondayUser.email}</p>
            <p><strong>ID:</strong> {mondayUser.id}</p>
            <p><strong>Is Admin:</strong> {mondayUser.is_admin ? 'Yes' : 'No'}</p>
            {mondayUser.photo_thumb && (
              <div>
                <strong>Photo:</strong>
                <img 
                  src={mondayUser.photo_thumb} 
                  alt={mondayUser.name}
                  style={{ width: '50px', height: '50px', borderRadius: '50%', marginLeft: '10px' }}
                />
              </div>
            )}
          </div>
        </div>
      )}
      {!mondayUser && (
        <div style={{ marginTop: '20px', color: '#666' }}>
          No Monday.com user details available
        </div>
      )}
    </div>
  );
};

export default HelloWorld;
