import { useState, useEffect } from 'react';
import { getHelloWorld } from '../apiController/controller';

const HelloWorld = () => {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);
        setError(null);
        const helloMessage = await getHelloWorld();
        setMessage(helloMessage);
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
    </div>
  );
};

export default HelloWorld;
