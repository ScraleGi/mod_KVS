import React from 'react';

/**
 * EditLabel is a flexible form field component that renders a labeled input,
 * select, or textarea based on the provided props.
 *
 * - Renders a <select> if type="select" and options are provided.
 * - Renders a <textarea> if type="textarea".
 * - Otherwise, renders a standard <input> of the given type.
 * - Accepts both string and ReactNode as labelName for flexible labeling.
 */
export function EditLabel({
    labelName,
    name,
    value,
    type = "text",
    required = true,
    autoFocus = false,
    options = [],
    rows = 2
}: {
    labelName: string | React.ReactNode;
    name: string;
    value: string | undefined;
    type?: string;
    required?: boolean;
    autoFocus?: boolean;
    options?: { value: string; label: string }[];
    rows?: number;
}) {
    // Ensure labelName is a string or a valid React element
    if (typeof labelName !== 'string' && !React.isValidElement(labelName)) {
        throw new Error("labelName must be a string or a valid React element");
    }
    // Ensure value is a string or undefined (for form compatibility)
    if (typeof value !== 'string' && typeof value !== 'undefined') {
        throw new Error("value must be a string or undefined");
    }

    // Render a select dropdown if type is "select" and options are provided
    if (type === "select" && options.length > 0) {
        return (
            <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                    {labelName}
                    <select
                        name={name}
                        required={required}
                        defaultValue={value}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        autoFocus={autoFocus}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        );
    } else if (type === "textarea") {
        // Render a textarea if type is "textarea"
        return (
            <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                    {labelName}
                    <textarea
                        name={name}
                        required={required}
                        defaultValue={value}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        autoFocus={autoFocus}
                        rows={rows}
                    />
                </label>
            </div>
        )
    }

    // Default: render a standard input field
    return (
        <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">
                {labelName}
                <input
                    name={name}
                    required={required}
                    type={type}
                    defaultValue={value}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    autoFocus={autoFocus}
                />
            </label>
        </div>
    );
}