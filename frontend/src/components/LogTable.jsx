// src/components/LogTable.jsx
export default function LogTable({ columns, data }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 bg-white rounded-2xl shadow-lg border border-gray-100 text-gray-400">
                Brak danych do wyświetlenia
            </div>
        );
    }

    return (
        <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-sm border border-white/40 overflow-hidden flex flex-col">
            <div className="max-h-64 overflow-y-auto w-full">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="uppercase tracking-wider border-b border-white/30 bg-white/40 sticky top-0 z-10">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className="px-6 py-4 text-gray-800 font-semibold">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-white-20">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className="px-6 py-3 text-gray-900 font-medium">
                                    {row[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
}