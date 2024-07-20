import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import NavBar from './NavBar/NavBar';
import axios from 'axios'; // Import axios
import { BASE_URL } from '../../Config/config';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Statatics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insight, setInsight] = useState('lastWeekSpend'); // Default to 'lastWeekSpend'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${BASE_URL}/api/expense/stats`,
          {},
          {
            headers: { token },
          },
        );
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateChartData = () => {
    switch (insight) {
      case 'lastWeekSpend':
        return {
          labels: ['Total Spending'],
          datasets: [
            {
              label: 'Amount',
              data: [data?.lastWeekSpend || 0],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        };
      case 'dailySpend':
        return {
          labels: data?.dailySpend.map(item => item._id) || [],
          datasets: [
            {
              label: 'Daily Spend',
              data: data?.dailySpend.map(item => item.total) || [],
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              borderColor: 'rgba(53, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        };
      case 'weeklySpend':
        return {
          labels: data?.weeklySpend.map(item => item._id) || [],
          datasets: [
            {
              label: 'Weekly Spend',
              data: data?.weeklySpend.map(item => item.total) || [],
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              borderColor: 'rgba(53, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        };
      case 'monthlySpend':
        return {
          labels: data?.monthlySpend.map(item => item._id) || [],
          datasets: [
            {
              label: 'Monthly Spend',
              data: data?.monthlySpend.map(item => item.total) || [],
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              borderColor: 'rgba(53, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        };
      case 'categorySpend':
        return {
          labels: data?.categorySpend.map(item => item._id) || [],
          datasets: [
            {
              label: 'Category Spend',
              data: data?.categorySpend.map(item => item.total) || [],
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              borderColor: 'rgba(53, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        };
      default:
        return {};
    }
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const handleInsightChange = newInsight => {
    setInsight(newInsight);
  };

  // Loading component
  const Loading = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
      }}
    >
      <div
        style={{
          border: '8px solid #f3f3f3' /* Light grey */,
          borderTop: '8px solid #3498db' /* Blue */,
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          animation: 'spin 1s linear infinite',
        }}
      ></div>
      <p>Loading...</p>
    </div>
  );

  // Error component
  const Error = ({ errMessage }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        fontSize: '18px',
      }}
    >
      <p>Error: {errMessage}</p>
    </div>
  );

  if (loading) return <Loading />;
  if (error) return <Error errMessage={error.message} />;
  if (!data) return <div>No data available</div>;

  return (
    <div>
      <NavBar />
      <div className="main-content">
        <h2>Statistics</h2>
        <div className="flex justify-center items-center" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
            <button
              onClick={() => handleInsightChange('lastWeekSpend')}
              style={{
                backgroundColor: insight === 'lastWeekSpend' ? '#3498db' : 'white',
                color: insight === 'lastWeekSpend' ? 'white' : 'black',
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '5px',
                border: `2px solid ${insight === 'lastWeekSpend' ? '#3498db' : '#3498db'}`,
                cursor: 'pointer',
              }}
            >
              Last Week Spend
            </button>
            <button
              onClick={() => handleInsightChange('dailySpend')}
              style={{
                backgroundColor: insight === 'dailySpend' ? '#3498db' : 'white',
                color: insight === 'dailySpend' ? 'white' : 'black',
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '5px',
                border: `2px solid ${insight === 'dailySpend' ? '#3498db' : '#3498db'}`,
                cursor: 'pointer',
              }}
            >
              Daily Spend
            </button>
            <button
              onClick={() => handleInsightChange('weeklySpend')}
              style={{
                backgroundColor: insight === 'weeklySpend' ? '#3498db' : 'white',
                color: insight === 'weeklySpend' ? 'white' : 'black',
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '5px',
                border: `2px solid ${insight === 'weeklySpend' ? '#3498db' : '#3498db'}`,
                cursor: 'pointer',
              }}
            >
              Weekly Spend
            </button>
            <button
              onClick={() => handleInsightChange('monthlySpend')}
              style={{
                backgroundColor: insight === 'monthlySpend' ? '#3498db' : 'white',
                color: insight === 'monthlySpend' ? 'white' : 'black',
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '5px',
                border: `2px solid ${insight === 'monthlySpend' ? '#3498db' : '#3498db'}`,
                cursor: 'pointer',
              }}
            >
              Monthly Spend
            </button>
            <button
              onClick={() => handleInsightChange('categorySpend')}
              style={{
                backgroundColor: insight === 'categorySpend' ? '#3498db' : 'white',
                color: insight === 'categorySpend' ? 'white' : 'black',
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '5px',
                border: `2px solid ${insight === 'categorySpend' ? '#3498db' : '#3498db'}`,
                cursor: 'pointer',
              }}
            >
              Category Spend
            </button>
          </div>

          <div className="chart-container" style={{ height: '400px', width: '400px' }}>
            <Bar data={generateChartData()} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statatics;
