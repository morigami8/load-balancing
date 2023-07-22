import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Chart, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const NUM_SERVERS = 3;

const fecthLoadData = async () => {
  try {
    const response = await axios.get(`/api/load-data`);
    return response.data;
  } catch (error: any) {
    console.error('Error Fetching data: ', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error Response', error.response.data);
      console.error('Error Status', error.response.status);
      console.error('Error Headers', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error Request', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
    }
  }
};
const App: React.FC = () => {
  const [loadData, setLoadData] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fecthLoadData();
        console.log('Fetched Data:', data);
        setLoadData(data);
      } catch (error) {
        console.error('Error Fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: Array(NUM_SERVERS)
      .fill('')
      .map((_, index) => `Server: ${index + 1}`),
    datasets: [
      {
        label: 'Load Distribution',
        data: loadData,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="App">
      <h1>Load Balancer Demo</h1>
      {loadData.length > 0 ? (
        <div>
          <h2>Load Distribution</h2>
          <div style={{ width: '400px', margin: '20px auto' }}>
            <Bar data={data} options={{ maintainAspectRatio: false }} />
          </div>
          <ul>
            {loadData.map((load, index) => (
              <li key={index}>
                Server {index + 1}: {load} requests
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
