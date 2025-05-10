//@ts-nocheck
'use client';

import { Checkbox, Tooltip } from 'flowbite-react';
import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useDebouncedCallback } from 'use-debounce';

// Define types for table data
type TableRow = {
    parameter: string;
    values: string[];
    isSectionHeader?: boolean;
};

type TableData = {
    headers: string[];
    rows: TableRow[];
};

interface TableEditorProps {
    // For standalone usage
    initialData?: TableData;
    onSave?: (data: TableData) => void;

    // For controlled component usage (when used inside another form)
    tableData?: TableData;
    setTableData?: (data: TableData) => void;

    // Optional props
    showTemplateControls?: boolean;
    showSaveControls?: boolean;
}

const defaultModel = {
    headers: ['Model', "Model Ar"],
    rows: [
        {
            parameter: 'Battery Type',
            values: [''],
            isSectionHeader: false,
        },
    ],
};

// Memoized row component
const TableRow = memo(({
    row,
    rowIndex,
    headers,
    updateParameter,
    updateRow,
    toggleSectionHeader,
    addRowBelow,
    deleteRow
}) => {
    // Local state for immediate UI feedback
    const [parameterValue, setParameterValue] = useState(row.parameter);
    const [cellValues, setCellValues] = useState([...row.values]);

    // Update local state when props change
    useEffect(() => {
        setParameterValue(row.parameter);
        setCellValues([...row.values]);
    }, [row.parameter, row.values]);

    // Create debounced handlers
    const debouncedUpdateParameter = useDebouncedCallback(
        (value) => {
            updateParameter(rowIndex, value);
        },
        500 // 300ms delay
    );

    const debouncedUpdateCell = useDebouncedCallback(
        (colIndex, value) => {
            updateRow(rowIndex, colIndex, value);
        },
        500 // 300ms delay
    );

    const handleParameterChange = (e) => {
        const value = e.target.value;
        setParameterValue(value); // Update local state immediately
        debouncedUpdateParameter(value); // Debounce the actual state update
    };

    const handleCellChange = (colIndex, e) => {
        const value = e.target.value;
        const newValues = [...cellValues];
        newValues[colIndex] = value;
        setCellValues(newValues); // Update local state immediately
        debouncedUpdateCell(colIndex, value); // Debounce the actual state update
    };

    return (
        <tr className={ row.isSectionHeader ? 'bg-gray-200' : '' }>
            <td className={ `border p-1 relative ${row.isSectionHeader ? 'bg-gray-400' : ''}` }
                colSpan={ row.isSectionHeader ? headers.length : 1 }>
                <div className="flex gap-1 mt-1 absolute left-[-90px] top-[10px]">
                    <Checkbox
                        checked={ row.isSectionHeader }
                        onChange={ () => toggleSectionHeader(rowIndex) }
                    />
                    <Tooltip content="insert">
                        <span
                            onClick={ () => addRowBelow(rowIndex) }
                            className="cursor-pointer text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                            +
                        </span>
                    </Tooltip>
                    <Tooltip content="Delete">
                        <span
                            onClick={ () => deleteRow(rowIndex) }
                            className="cursor-pointer text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                            🗑
                        </span>
                    </Tooltip>
                </div>
                <input
                    value={ parameterValue }
                    onChange={ handleParameterChange }
                    className={ `w-full p-1 border rounded border-none ${row.isSectionHeader ? 'text-center font-bold' : ''}` }
                    placeholder="Parameter name"
                />
            </td>
            { !row.isSectionHeader && cellValues.map((val, colIndex) => (
                <td key={ colIndex } className="border p-1">
                    <input
                        value={ val }
                        onChange={ (e) => handleCellChange(colIndex, e) }
                        className="w-full p-1 border-none rounded"
                        placeholder="Value"
                    />
                </td>
            )) }
        </tr>
    );
});

// Memoized header component
const TableHeader = memo(({ headers, updateHeader, removeHeader }) => {
    // Local state for immediate UI feedback
    const [headerValues, setHeaderValues] = useState([...headers]);

    // Update local state when props change
    useEffect(() => {
        setHeaderValues([...headers]);
    }, [headers]);

    // Create debounced handler
    const debouncedUpdateHeader = useDebouncedCallback(
        (index, value) => {
            updateHeader(index, value);
        },
        500 // 300ms delay
    );

    const handleHeaderChange = (index, e) => {
        const value = e.target.value;
        const newValues = [...headerValues];
        newValues[index] = value;
        setHeaderValues(newValues); // Update local state immediately
        debouncedUpdateHeader(index, value); // Debounce the actual state update
    };

    return (
        <tr>
            { headerValues.map((header, i) => (
                <th key={ i } className="border px-2 py-1 bg-gray-100">
                    <div className="flex items-center gap-1">
                        <input
                            value={ header }
                            onChange={ (e) => handleHeaderChange(i, e) }
                            className="w-full p-1 border-none rounded"
                            placeholder="Column name"
                        />
                        { i > 0 && (
                            <button
                                onClick={ () => removeHeader(i) }
                                className="text-red-500 border border-red-400 rounded-4xl p-1 hover:text-red-700"
                                title="Remove column"
                            >
                                ❌
                            </button>
                        ) }
                    </div>
                </th>
            )) }
        </tr>
    );
});

export default function TableEditor({
    initialData,
    onSave,
    tableData: externalTableData,
    setTableData: setExternalTableData,
    showTemplateControls = true,
    showSaveControls = true,
}: TableEditorProps) {
    // Use internal state if not controlled externally
    const [internalTableData, setInternalTableData] = useState<TableData>(initialData || defaultModel);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Determine if component is controlled externally
    const isControlled = externalTableData !== undefined && setExternalTableData !== undefined;

    // Use the appropriate data and setter based on whether the component is controlled
    const data = isControlled ? externalTableData : internalTableData;
    const setData = isControlled
        ? setExternalTableData
        : setInternalTableData;

    // Load available templates
    useEffect(() => {
        if (showTemplateControls) {
            setIsLoading(true);
            fetch('/api/templates')
                .then((res) => res.json())
                .then((data) => {
                    setAvailableTemplates(data || []);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error('Error loading templates:', err);
                    setError('Failed to load templates');
                    setIsLoading(false);
                });
        }
    }, [showTemplateControls]);

    // Clear messages after 3 seconds
    useEffect(() => {
        if (error || successMessage) {
            const timer = setTimeout(() => {
                setError('');
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, successMessage]);

    // Memoize event handlers with useCallback
    const updateHeader = useCallback((index: number, value: string) => {
        const updated = [...data.headers];
        updated[index] = value;
        setData({ ...data, headers: updated });
    }, [data, setData]);

    const addHeader = useCallback(() => {
        setData({
            ...data,
            headers: [...data.headers, ''],
            rows: data.rows.map((row) => ({ ...row, values: [...row.values, ''] })),
        });
    }, [data, setData]);

    const removeHeader = useCallback((index: number) => {
        const newHeaders = [...data.headers];
        newHeaders.splice(index, 1);
        const newRows = data.rows.map((row) => {
            const newValues = [...row.values];
            newValues.splice(index - 1, 1);
            return { ...row, values: newValues };
        });
        setData({ headers: newHeaders, rows: newRows });
    }, [data, setData]);

    const updateRow = useCallback((rowIndex: number, colIndex: number, value: string) => {
        setData(prevData => {
            const updatedRows = [...prevData.rows];
            updatedRows[rowIndex] = {
                ...updatedRows[rowIndex],
                values: [...updatedRows[rowIndex].values]
            };
            updatedRows[rowIndex].values[colIndex] = value;
            return { ...prevData, rows: updatedRows };
        });
    }, [setData]);

    const updateParameter = useCallback((rowIndex: number, value: string) => {
        setData(prevData => {
            const updatedRows = [...prevData.rows];
            updatedRows[rowIndex] = {
                ...updatedRows[rowIndex],
                parameter: value
            };
            return { ...prevData, rows: updatedRows };
        });
    }, [setData]);

    const addRowBelow = useCallback((rowIndex: number) => {
        const newRow = {
            parameter: '',
            values: new Array(data.headers.length - 1).fill(''),
            isSectionHeader: false,
        };

        // Handle the case when rows array is empty or rowIndex is invalid
        if (data.rows.length === 0 || rowIndex < 0) {
            setData(prevData => ({ ...prevData, rows: [...prevData.rows, newRow] }));
            return;
        }

        setData(prevData => {
            const updated = [...prevData.rows];
            updated.splice(rowIndex + 1, 0, newRow);
            return { ...prevData, rows: updated };
        });
    }, [data.headers.length, data.rows.length, setData]);

    const deleteRow = useCallback((rowIndex: number) => {
        setData(prevData => {
            const updated = [...prevData.rows];
            updated.splice(rowIndex, 1);
            return { ...prevData, rows: updated };
        });
    }, [setData]);

    const toggleSectionHeader = useCallback((index: number) => {
        setData(prevData => {
            const updated = [...prevData.rows];
            updated[index] = {
                ...updated[index],
                isSectionHeader: !updated[index].isSectionHeader
            };
            return { ...prevData, rows: updated };
        });
    }, [setData]);

    const saveTemplate = async () => {
        const name = prompt('Enter template name:');
        if (!name) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    rows: data.rows,
                    headers: data.headers
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save template');
            }

            setSuccessMessage('Template saved successfully!');
            // Refresh templates list
            const templatesResponse = await fetch('/api/templates');
            const templatesData = await templatesResponse.json();
            setAvailableTemplates(templatesData || []);
        } catch (error: any) {
            console.error('Error saving template:', error);
            setError(`Failed to save template: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const loadTemplate = async (id: string) => {
        setIsLoading(true);
        setError('');

        try {
            // Find the selected template in the available templates
            const selectedTemplate = availableTemplates.find(template => template._id === id);

            if (selectedTemplate) {
                // Extract the headers and rows from the template
                const { headers, rows } = selectedTemplate;

                // Update the table data
                setData({ headers, rows });
                setSuccessMessage('Template loaded successfully!');
            } else {
                throw new Error('Template not found');
            }
        } catch (error: any) {
            console.error('Error loading template:', error);
            setError(`Failed to load template: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const saveProductTable = async () => {
        if (onSave) {
            onSave(data);
            return;
        }

        const productId = prompt('Enter product ID to save table:');
        if (!productId) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId,
                    table: data
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save product');
            }

            setSuccessMessage('Product saved to MongoDB!');
        } catch (error: any) {
            console.error('Error saving product:', error);
            setError(`Failed to save product: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Memoize the table data to prevent unnecessary re-renders
    const memoizedHeaders = useMemo(() => data.headers, [data.headers]);
    const memoizedRows = useMemo(() => data.rows, [data.rows]);

    return (
        <div className="p-4 space-y-4 pl-[100px]">
            {/* Status Messages */ }
            { error && (
                <div className="p-3 bg-red-100 text-red-700 rounded">
                    { error }
                </div>
            ) }

            { successMessage && (
                <div className="p-3 bg-green-100 text-green-700 rounded">
                    { successMessage }
                </div>
            ) }

            {/* Controls */ }
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={ addHeader }
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={ isLoading }
                >
                    + Add Column
                </button>

                { showTemplateControls && (
                    <>
                        <button
                            onClick={ saveTemplate }
                            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                            disabled={ isLoading }
                        >
                            💾 Save as Template
                        </button>

                        <select
                            value={ selectedTemplate }
                            onChange={ (e) => loadTemplate(e.target.value) }
                            className="border px-2 py-1 rounded"
                            disabled={ isLoading || availableTemplates.length === 0 }
                        >
                            <option value="">Select Template</option>
                            { availableTemplates && availableTemplates?.length && (availableTemplates?.map((template: any) => (
                                <option key={ template._id } value={ template._id }>
                                    { template.name }
                                </option>
                            ))) }
                        </select>
                    </>
                ) }

                { showSaveControls && (
                    <button
                        onClick={ saveProductTable }
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        disabled={ isLoading }
                    >
                        📥 Save to MongoDB
                    </button>
                ) }

                { isLoading && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded">
                        Loading...
                    </span>
                ) }
            </div>

            {/* Table Editor */ }
            <div className="">
                <table className="table-auto w-full border border-gray-300">
                    <thead>
                        <TableHeader
                            headers={ memoizedHeaders }
                            updateHeader={ updateHeader }
                            removeHeader={ removeHeader }
                        />
                    </thead>
                    <tbody>
                        { memoizedRows.length > 0 ? (
                            memoizedRows.map((row, rowIndex) => (
                                <TableRow
                                    key={ rowIndex }
                                    row={ row }
                                    rowIndex={ rowIndex }
                                    headers={ memoizedHeaders }
                                    updateParameter={ updateParameter }
                                    updateRow={ updateRow }
                                    toggleSectionHeader={ toggleSectionHeader }
                                    addRowBelow={ addRowBelow }
                                    deleteRow={ deleteRow }
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={ memoizedHeaders.length + 1 } className="border p-4 text-center text-gray-500">
                                    No rows yet. Click "Add Row" to start building your table.
                                </td>
                            </tr>
                        ) }
                    </tbody>
                </table>
            </div>

            {/* Add row at the end */ }
            <button
                onClick={ () => data.rows.length > 0 ? addRowBelow(data.rows.length - 1) : addRowBelow(-1) }
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={ isLoading }
            >
                + Add Row
            </button>
        </div>
    );
}
