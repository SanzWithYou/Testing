import React from 'react';

interface DataTableProps<T> {
    columns: { header: string; accessor: keyof T | ((item: T) => React.ReactNode) }[];
    data: T[];
    actions?: (item: T) => React.ReactNode;
}

const DataTable = <T extends { id: string | number }>(
    { columns, data, actions }: DataTableProps<T>
) => {
    return (
        <div className="bg-dark/50 backdrop-blur-sm shadow-lg rounded-xl overflow-x-auto ring-1 ring-white/10">
            <table className="w-full text-sm text-left text-slate-400">
                <thead className="text-xs text-slate-300 uppercase bg-slate-800/60">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} scope="col" className="px-6 py-4 font-semibold">
                                {col.header}
                            </th>
                        ))}
                        {actions && <th scope="col" className="px-6 py-4 text-right">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item) => (
                            <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-500/10 transition-colors duration-200">
                                {columns.map((col, index) => (
                                    <td key={index} className="px-6 py-4 whitespace-nowrap">
                                        {typeof col.accessor === 'function'
                                            ? col.accessor(item)
                                            : String(item[col.accessor])}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end items-center space-x-2">
                                            {actions(item)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8">
                                No data available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;