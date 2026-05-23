import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useGetUserChartDataQuery } from '@/store/services/dashboardApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function UserChart() {
  const { data, isLoading, error } = useGetUserChartDataQuery();

  const chartData = useMemo(() => {
    if (!data?.data.chartData) return null;

    return {
      labels: data.data.chartData.map(item => item.label),
      datasets: [
        {
          label: 'New Users',
          data: data.data.chartData.map(item => item.value),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => `${context.raw} users`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          stepSize: 1,
        },
        beginAtZero: true,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className="h-64 flex items-center justify-center text-secondary-500">
        Unable to load chart data
      </div>
    );
  }

  return (
    <div className="h-64">
      <Bar data={chartData} options={options as any} />
    </div>
  );
}
