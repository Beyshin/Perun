// src/components/LogTable.jsx
import React from 'react';

export default function LogTable({ columns, data }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 bg-white rounded-2xl shadow-lg border border-gray-100 text-gray-400">
                Brak danych do wyświetlenia
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
            <div className="max-h-80 overflow-y-auto w-full">
                <table className="min-w-full text-left text-sm whitespace-nowrap">

                    <thead className="uppercase tracking-wider border-b-2 border-gray-100 bg-gray-50 sticky top-0 z-10">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className="px-6 py-4 text-gray-500 font-semibold">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className="px-6 py-4 text-gray-700">
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