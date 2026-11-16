import {Chart} from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


export default function Graph(props) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#1f2937', font: { weight: 'bold' } }
            },
        },
        scales: {
            y: {
                beginAtZero: false,
                title: { display: true, text: 'Wartość', color: '#374151' },
                ticks: { color: '#1f2937' },
                grid: { color: 'rgba(255, 255, 255, 0.25)' }
            },
            x: {
                title: { display: true, text: 'Czas', color: '#374151' },
                ticks: { color: '#1f2937' },
                grid: { color: 'rgba(255, 255, 255, 0.25)' }
            }
        }
    };

    return (
        <div className="flex-1 min-w-[350px] h-96 bg-white/30 backdrop-blur-md rounded-xl shadow-sm p-6 border border-white/40">
            <Chart type={props.type} data={props.data} options={options} />
        </div>
    );
}