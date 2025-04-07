'use client';

import { useEffect, useState } from 'react';

export default function PythonTest() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/papi/python');
        const data = await response.json();
        setMessage(JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching from Python API:', error);
        setMessage('Error connecting to Python API');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Python API Test</h1>
        <p className="text-lg">{message || 'Loading...'}</p>
      </div>
    </div>
  );
} 