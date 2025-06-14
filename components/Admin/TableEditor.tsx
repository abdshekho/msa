//@ts-nocheck
'use client';

import { Checkbox, Tooltip } from 'flowbite-react';
import { useEffect, useState, useMemo, useCallback, memo, useRef, useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import dynamic from 'next/dynamic';

// Define proper TypeScript types
interface TableRow {
    parameter: string;
    values: string[];
    isSectionHeader?: boolean;
}

interface TableData {
    headers: string[];
    rows: TableRow[];
}

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

interface BatchUpdate {
    rowIndex: number;
    colIndex?: number;
    value: string;
    type: 'parameter' | 'cell';
}

const defaultModel: TableData = {
    headers: ['Model', "Model Ar"],
    rows: [
        {
            parameter: 'Battery Type',
            values: [''],
            isSectionHeader: false,
        },
    ],
};

// Memoized row component with optimized updates
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
        1000 // 500ms delay
    );

    const debouncedUpdateCell = useDebouncedCallback(
        (colIndex, value) => {
            updateRow(rowIndex, colIndex, value);
        },
        1000 // 500ms delay
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
        <tr className={ row.isSectionHeader ? 'bg-gray-200 dark:bg-gray-800' : 'dark:bg-gray-700' }>
            <td className={ `border p-1 relative ${row.isSectionHeader ? 'bg-gray-200 dark:bg-gray-800' : 'bg-blue-50   dark:bg-sky-950 text-black dark:text-white'}` }
                colSpan={ row.isSectionHeader ? headers.length : 1 }>
                <div className="flex items-center gap-1 mt-1 absolute left-[-90px] top-[10px]">
                    <Checkbox
                        className='p-2'
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
                    value={ parameterValue } required
                    onChange={ handleParameterChange }
                    className={ `w-full p-1 border rounded border-none  ${row.isSectionHeader ? 'dark:text-secondary-10 text-center font-bold dark:bg-gray-800' : 'bg-blue-50   dark:bg-sky-950 text-black dark:text-white'}` }
                    placeholder="Parameter name"
                />
            </td>
            { !row.isSectionHeader && cellValues.map((val, colIndex) => (
                <td key={ colIndex } className="border p-1">
                    <input
                        value={ val } required={colIndex === 0}
                        onChange={ (e) => handleCellChange(colIndex, e) }
                        className="w-full p-1 border-none rounded dark:bg-transparent dark:text-[lightgray]"
                        placeholder="Value"
                    />
                </td>
            )) }
        </tr>
    );
});

// Ensure display name is set for memo components
TableRow.displayName = 'TableRow';

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
        1000 // 500ms delay
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
                <th key={ i } className="border px-2 py-1 bg-gray-100 dark:bg-stone-900 dark:text-white">
                    <div className="flex items-center gap-1">
                        <input
                            value={ header } required
                            onChange={ (e) => handleHeaderChange(i, e) }
                            className="w-full p-1 border-none rounded bg-gray-100 dark:bg-stone-900 text-primary dark:text-primary-10 text-center"
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

// Ensure display name is set for memo components
TableHeader.displayName = 'TableHeader';

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
    const [templatesLoaded, setTemplatesLoaded] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Batch updates for better performance
    const batchedUpdates = useRef<BatchUpdate[]>([]);

    // Determine if component is controlled externally
    const isControlled = externalTableData !== undefined && setExternalTableData !== undefined;

    // Use the appropriate data and setter based on whether the component is controlled
    const data = isControlled ? externalTableData : internalTableData;
    const setData = isControlled
        ? setExternalTableData
        : setInternalTableData;

    // Lazy load templates only when needed
    const loadTemplates = useCallback(async () => {
        if (!templatesLoaded && showTemplateControls) {
            setIsLoading(true);
            try {
                const response = await fetch('/api/templates');
                const data = await response.json();
                setAvailableTemplates(data || []);
                setTemplatesLoaded(true);
            } catch (err) {
                console.error('Error loading templates:', err);
                setError('Failed to load templates');
            } finally {
                setIsLoading(false);
            }
        }
    }, [templatesLoaded, showTemplateControls]);

    // Load templates when template controls are shown
    useEffect(() => {
        if (showTemplateControls && !templatesLoaded) {
            loadTemplates();
        }
    }, [showTemplateControls, templatesLoaded, loadTemplates]);

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

    // Flush batched updates
    const flushUpdates = useCallback(() => {
        if (batchedUpdates.current.length > 0) {
            startTransition(() => {
                setData(prevData => {
                    const updatedData = { ...prevData, rows: [...prevData.rows] };

                    batchedUpdates.current.forEach(update => {
                        if (update.type === 'parameter') {
                            updatedData.rows[update.rowIndex] = {
                                ...updatedData.rows[update.rowIndex],
                                parameter: update.value
                            };
                        } else if (update.type === 'cell' && update.colIndex !== undefined) {
                            const updatedValues = [...updatedData.rows[update.rowIndex].values];
                            updatedValues[update.colIndex] = update.value;
                            updatedData.rows[update.rowIndex] = {
                                ...updatedData.rows[update.rowIndex],
                                values: updatedValues
                            };
                        }
                    });

                    batchedUpdates.current = [];
                    return updatedData;
                });
            });
        }
    }, [setData]);

    // Memoize event handlers with useCallback
    const updateHeader = useCallback((index: number, value: string) => {
        startTransition(() => {
            setData(prevData => {
                const updated = [...prevData.headers];
                updated[index] = value;
                return { ...prevData, headers: updated };
            });
        });
    }, [setData]);

    const addHeader = useCallback(() => {
        startTransition(() => {
            setData(prevData => ({
                ...prevData,
                headers: [...prevData.headers, ''],
                rows: prevData.rows.map((row) => ({
                    ...row,
                    values: [...row.values, '']
                })),
            }));
        });
    }, [setData]);

    const removeHeader = useCallback((index: number) => {
        startTransition(() => {
            setData(prevData => {
                const newHeaders = [...prevData.headers];
                newHeaders.splice(index, 1);
                const newRows = prevData.rows.map((row) => {
                    const newValues = [...row.values];
                    newValues.splice(index - 1, 1);
                    return { ...row, values: newValues };
                });
                return { headers: newHeaders, rows: newRows };
            });
        });
    }, [setData]);

    const updateRow = useCallback((rowIndex: number, colIndex: number, value: string) => {
        batchedUpdates.current.push({
            rowIndex,
            colIndex,
            value,
            type: 'cell'
        });
        flushUpdates();
    }, [flushUpdates]);

    const updateParameter = useCallback((rowIndex: number, value: string) => {
        batchedUpdates.current.push({
            rowIndex,
            value,
            type: 'parameter'
        });
        flushUpdates();
    }, [flushUpdates]);

    const addRowBelow = useCallback((rowIndex: number) => {
        const newRow = {
            parameter: '',
            values: new Array(data.headers.length - 1).fill(''),
            isSectionHeader: false,
        };

        startTransition(() => {
            setData(prevData => {
                // Handle the case when rows array is empty or rowIndex is invalid
                if (prevData.rows.length === 0 || rowIndex < 0) {
                    return { ...prevData, rows: [...prevData.rows, newRow] };
                }

                const updated = [...prevData.rows];
                updated.splice(rowIndex + 1, 0, newRow);
                return { ...prevData, rows: updated };
            });
        });
    }, [data.headers.length, setData]);

    const deleteRow = useCallback((rowIndex: number) => {
        startTransition(() => {
            setData(prevData => {
                const updated = [...prevData.rows];
                updated.splice(rowIndex, 1);
                return { ...prevData, rows: updated };
            });
        });
    }, [setData]);

    const toggleSectionHeader = useCallback((index: number) => {
        startTransition(() => {
            setData(prevData => {
                const updated = [...prevData.rows];
                updated[index] = {
                    ...updated[index],
                    isSectionHeader: !updated[index].isSectionHeader
                };
                return { ...prevData, rows: updated };
            });
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
                startTransition(() => {
                    setData({ headers, rows });
                });
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
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // productId,
                    table: data
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save template');
            }

            setSuccessMessage(`save template to ${productId} is successfully `);
        } catch (error: any) {
            console.error('Error saving template:', error);
            setError(`Failed to save template:  ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Memoize the table data to prevent unnecessary re-renders
    const memoizedHeaders = useMemo(() => data.headers, [data.headers]);
    const memoizedRows = useMemo(() => data.rows, [data.rows]);

    // Determine if we should use virtualization
    const shouldVirtualize = memoizedRows.length > 20;

    return (
        <div className="p-4 space-y-4 pl-[100px]" style={{direction:'ltr'}}>
            {/* Status Messages */ }
            { error && (
                <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded">
                    { error }
                </div>
            ) }

            { successMessage && (
                <div className="p-3 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded">
                    { successMessage }
                </div>
            ) }

            <div className="p-3 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded h-[48px]">
                {/* Loading indicator */ }
                { (isLoading || isPending) && (
                    <span>Processing...</span>
                ) }
            </div>

            {/* Controls */ }
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={ addHeader }
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                    disabled={ isLoading || isPending }
                >
                    + Add Column
                </button>

                { showTemplateControls && (
                    <>
                        <button
                            onClick={ saveTemplate }
                            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-800"
                            disabled={ isLoading || isPending }
                        >
                            💾 Save as Template
                        </button>

                        <select
                            value={ selectedTemplate }
                            onChange={ (e) => loadTemplate(e.target.value) }
                            className="border px-2 py-1 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            disabled={ isLoading || isPending || availableTemplates.length === 0 }
                            onClick={ () => !templatesLoaded && loadTemplates() }
                        >
                            <option value="">Select Template</option>
                            { availableTemplates && availableTemplates.length > 0 && (
                                availableTemplates.map((template: any) => (
                                    <option key={ template._id } value={ template._id }>
                                        { template.name }
                                    </option>
                                ))
                            ) }
                        </select>
                    </>
                ) }

                { showSaveControls && (
                    <button
                        onClick={ saveProductTable }
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
                        disabled={ isLoading || isPending }
                    >
                        📥 Save to product by ID
                    </button>
                ) }
            </div>

            {/* Table Editor */ }
            <div className="">
                <table className="table-auto w-full border border-gray-300 dark:border-gray-600">
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
                                <td colSpan={ memoizedHeaders.length + 1 } className="border p-4 text-center text-gray-500 dark:text-gray-400 dark:border-gray-600">
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
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                disabled={ isLoading || isPending }
            >
                + Add Row
            </button>
        </div>
    );
}