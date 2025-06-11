//@ts-nocheck
'use client';

import { Checkbox, Tooltip } from 'flowbite-react';
import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dynamic from 'next/dynamic';

// Zod Schema Definition
const tableRowSchema = z.object({
    parameter: z.string().min(1, 'Parameter name is required'),
    values: z.array(z.string()),
    isSectionHeader: z.boolean().default(false),
});

const tableDataSchema = z.object({
    headers: z.array(z.string().min(1, 'Header name is required')).min(1, 'At least one header is required'),
    rows: z.array(tableRowSchema).min(1, 'At least one row is required'),
});

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

type FormData = z.infer<typeof tableDataSchema>;

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

// Memoized row component with react-hook-form integration
const TableRow = memo(({
    row,
    rowIndex,
    headers,
    control,
    register,
    watch,
    setValue,
    addRowBelow,
    deleteRow,
    errors
}) => {
    const watchedRow = watch(`rows.${rowIndex}`);
    const rowErrors = errors?.rows?.[rowIndex];

    const toggleSectionHeader = () => {
        setValue(`rows.${rowIndex}.isSectionHeader`, !watchedRow.isSectionHeader);
    };

    return (
        <tr className={ watchedRow?.isSectionHeader ? 'bg-gray-200 dark:bg-gray-700' : 'dark:bg-gray-800' }>
            <td className={ `border p-1 relative ${watchedRow?.isSectionHeader ? 'bg-gray-400 dark:bg-black' : 'dark:bg-gray-700'}` }
                colSpan={ watchedRow?.isSectionHeader ? headers.length : 1 }>
                <div className="flex gap-1 mt-1 absolute left-[-90px] top-[10px]">
                    <Controller
                        name={ `rows.${rowIndex}.isSectionHeader` }
                        control={ control }
                        render={ ({ field }) => (
                            <Checkbox
                                checked={ field.value || false }
                                onChange={ field.onChange }
                            />
                        ) }
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
                <div>
                    <input
                        { ...register(`rows.${rowIndex}.parameter`) }
                        className={ `w-full p-1 border rounded border-none dark:text-secondary-10 ${watchedRow?.isSectionHeader ? 'text-center font-bold dark:bg-black' : 'dark:bg-gray-700'
                            } ${rowErrors?.parameter ? 'border-red-500' : ''}` }
                        placeholder="Parameter name"
                    />
                    { rowErrors?.parameter && (
                        <span className="text-red-500 text-xs">{ rowErrors.parameter.message }</span>
                    ) }
                    <span className="text-red-500 text-xs">aboood</span>

                </div>
            </td>
            { !watchedRow?.isSectionHeader && watchedRow?.values?.map((val, colIndex) => (
                <td key={ colIndex } className="border p-1">
                    <input
                        { ...register(`rows.${rowIndex}.values.${colIndex}`) }
                        className="w-full p-1 border-none rounded dark:bg-transparent dark:text-[lightgray]"
                        placeholder="Value"
                    />
                    <span className="text-red-500 text-xs">aboood</span>

                </td>
            )) }
        </tr>
    );
});

TableRow.displayName = 'TableRow';

// Memoized header component with react-hook-form integration
const TableHeader = memo(({ headers, control, register, removeHeader, errors }) => {
    return (
        <tr>
            { headers.map((header, i) => (
                <th key={ i } className="border px-2 py-1 bg-gray-100 dark:bg-gray-600 dark:text-white">
                    <div className="flex items-center gap-1">
                        <div className="flex-1">
                            <input
                                { ...register(`headers.${i}`) }
                                className={ `w-full p-1 border-none rounded dark:bg-gray-600 dark:text-primary-10 ${errors?.headers?.[i] ? 'border-red-500' : ''
                                    }` }
                                placeholder="Column name"
                            />
                            { errors?.headers?.[i] && (
                                <span className="text-red-500 text-xs">{ errors.headers[i].message }</span>
                            ) }
                        </div>
                        { i > 0 && (
                            <button
                                type="button"
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

TableHeader.displayName = 'TableHeader';

export default function TableEditor({
    initialData,
    onSave,
    tableData: externalTableData,
    setTableData: setExternalTableData,
    showTemplateControls = true,
    showSaveControls = true,
}: TableEditorProps) {
    // States for external functionality
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [templatesLoaded, setTemplatesLoaded] = useState(false);

    // Determine if component is controlled externally
    const isControlled = externalTableData !== undefined && setExternalTableData !== undefined;

    // Initialize form with react-hook-form
    const {
        control,
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isValid, isDirty },
        getValues,
    } = useForm<FormData>({
        resolver: zodResolver(tableDataSchema),
        defaultValues: isControlled ? externalTableData : (initialData || defaultModel),
        mode: 'onChange', // Validate on change for better UX
    });

    // Use field arrays for dynamic headers and rows
    const {
        fields: headerFields,
        append: appendHeader,
        remove: removeHeaderField,
    } = useFieldArray({
        control,
        name: 'headers',
    });

    const {
        fields: rowFields,
        append: appendRow,
        remove: removeRow,
        insert: insertRow,
    } = useFieldArray({
        control,
        name: 'rows',
    });

    // Watch all form data for controlled component updates
    const watchedData = watch();

    // Update external state when form data changes (for controlled component)
    useEffect(() => {
        if (isControlled && setExternalTableData) {
            setExternalTableData(watchedData);
        }
    }, [watchedData, isControlled, setExternalTableData]);

    // Update form when external data changes (for controlled component)
    useEffect(() => {
        if (isControlled && externalTableData) {
            reset(externalTableData);
        }
    }, [externalTableData, isControlled, reset]);

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

    // Event handlers
    const addHeader = useCallback(() => {
        const currentHeaders = getValues('headers');
        const currentRows = getValues('rows');

        appendHeader('');

        // Add empty value to all existing rows
        currentRows.forEach((_, index) => {
            const currentValues = getValues(`rows.${index}.values`);
            setValue(`rows.${index}.values`, [...currentValues, '']);
        });
    }, [appendHeader, getValues, setValue]);

    const removeHeader = useCallback((index: number) => {
        if (index === 0) return; // Don't remove first header

        const currentRows = getValues('rows');

        removeHeaderField(index);

        // Remove corresponding value from all rows
        currentRows.forEach((_, rowIndex) => {
            const currentValues = getValues(`rows.${rowIndex}.values`);
            const newValues = currentValues.filter((_, colIndex) => colIndex !== index - 1);
            setValue(`rows.${rowIndex}.values`, newValues);
        });
    }, [removeHeaderField, getValues, setValue]);

    const addRowBelow = useCallback((rowIndex: number) => {
        const headersLength = getValues('headers').length;
        const newRow = {
            parameter: '',
            values: new Array(headersLength - 1).fill(''),
            isSectionHeader: false,
        };

        if (rowIndex === -1 || rowFields.length === 0) {
            appendRow(newRow);
        } else {
            insertRow(rowIndex + 1, newRow);
        }
    }, [appendRow, insertRow, getValues, rowFields.length]);

    const deleteRow = useCallback((rowIndex: number) => {
        removeRow(rowIndex);
    }, [removeRow]);

    // Form submission handler
    const onSubmit = (data: FormData) => {
        if (onSave) {
            onSave(data);
        } else {
            saveProductTable(data);
        }
    };

    const saveTemplate = async () => {
        const name = prompt('Enter template name:');
        if (!name) return;

        const formData = getValues();

        // Validate before saving
        if (!isValid) {
            setError('Please fix validation errors before saving template');
            return;
        }

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
                    rows: formData.rows,
                    headers: formData.headers
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
            const selectedTemplate = availableTemplates.find(template => template._id === id);

            if (selectedTemplate) {
                const { headers, rows } = selectedTemplate;
                reset({ headers, rows });
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

    const saveProductTable = async (data?: FormData) => {
        const formData = data || getValues();

        if (!isValid) {
            setError('Please fix validation errors before saving');
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
                    table: formData
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

    // Memoize the watched data
    const memoizedHeaders = useMemo(() => watchedData.headers, [watchedData.headers]);
    const memoizedRows = useMemo(() => watchedData.rows, [watchedData.rows]);

    return (
        <form onSubmit={ handleSubmit(onSubmit) } className="p-4 space-y-4 pl-[100px]">
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

            {/* Form Validation Status */ }
            <div className="p-3 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded h-[48px] flex items-center justify-between">
                <div>
                    { isLoading && <span>Processing...</span> }
                    { !isLoading && (
                        <span>
                            Form Status: { isValid ? '✅ Valid' : '❌ Invalid' }
                            { isDirty && ' • Modified' }
                        </span>
                    ) }
                </div>
                { Object.keys(errors).length > 0 && (
                    <span className="text-red-600 text-sm">
                        { Object.keys(errors).length } validation error(s)
                    </span>
                ) }
            </div>

            {/* Controls */ }
            <div className="flex gap-2 flex-wrap">
                <button
                    type="button"
                    onClick={ addHeader }
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                    disabled={ isLoading }
                >
                    + Add Column
                </button>

                { showTemplateControls && (
                    <>
                        <button
                            type="submit"
                            onClick={ saveTemplate }
                            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-800"
                            disabled={ isLoading || !isValid }
                        >
                            💾 Save as Template
                        </button>

                        <select
                            value={ selectedTemplate }
                            onChange={ (e) => loadTemplate(e.target.value) }
                            className="border px-2 py-1 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            disabled={ isLoading || availableTemplates.length === 0 }
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
                        type="submit"
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
                        disabled={ isLoading || !isValid }
                    >
                        📥 Save to MongoDB
                    </button>
                ) }
            </div>

            {/* Global Form Errors */ }
            { errors.headers && (
                <div className="p-2 bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200 rounded text-sm">
                    Headers: { errors.headers.message || 'Invalid headers' }
                </div>
            ) }

            { errors.rows && (
                <div className="p-2 bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200 rounded text-sm">
                    Rows: { errors.rows.message || 'Invalid rows' }
                </div>
            ) }

            {/* Table Editor */ }
            <div className="">
                <table className="table-auto w-full border border-gray-300 dark:border-gray-600">
                    <thead>
                        <TableHeader
                            headers={ memoizedHeaders }
                            control={ control }
                            register={ register }
                            removeHeader={ removeHeader }
                            errors={ errors }
                        />
                    </thead>
                    <tbody>
                        { rowFields.length > 0 ? (
                            rowFields.map((field, rowIndex) => (
                                <TableRow
                                    key={ field.id }
                                    row={ memoizedRows[rowIndex] }
                                    rowIndex={ rowIndex }
                                    headers={ memoizedHeaders }
                                    control={ control }
                                    register={ register }
                                    watch={ watch }
                                    setValue={ setValue }
                                    addRowBelow={ addRowBelow }
                                    deleteRow={ deleteRow }
                                    errors={ errors }
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
                type="button"
                onClick={ () => addRowBelow(rowFields.length - 1) }
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                disabled={ isLoading }
            >
                + Add Row
            </button>
        </form>
    );
}