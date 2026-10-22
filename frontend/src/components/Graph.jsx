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
            legend: { position: 'top' },
        },
        scales: {
            y: { title: { display: true, text: 'Wartość' } },
            x: { title: { display: true, text: 'Czas' } }
        }
    };
    return (
        <div className="w-1/2 h-96 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <Chart type={props.type} data={props.data} options={options} ></Chart>
        </div>
    )
}