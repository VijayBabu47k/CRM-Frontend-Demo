import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useGetRevenueChartDataQuery } from '@/store/services/dashboardApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function RevenueChart() {
  const { data, isLoading, error } = useGetRevenueChartDataQuery('monthly');

  const chartData = useMemo(() => {
    if (!data?.data.chartData) return null;

    return {
      labels: data.data.chartData.map(item => item.label),
      datasets: [
        {
          label: 'Revenue',
          data: data.data.chartData.map(item => item.value),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
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
          label: (context: any) => `$${context.raw.toLocaleString()}`,
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
          callback: (value: number) => `$${value.toLocaleString()}`,
        },
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
      <Line data={chartData} options={options as any} />
    </div>
  );
}
