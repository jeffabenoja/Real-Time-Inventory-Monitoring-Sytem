import { useState, ChangeEvent, useEffect } from "react";
import { UseFormRegister } from "react-hook-form";

interface Props {
    loading?: boolean;
    options: string[];
    defaultValue?: string;
    id: string
    label?: string
    registrationKey?: string
    register?: UseFormRegister<any>;
}

export default function AutocompleteInput({ loading, options, register, id, registrationKey, label, defaultValue }: Props) {
    const [inputValue, setInputValue] = useState(defaultValue!);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setInputValue(defaultValue || "");
    }, [defaultValue]);

    const handleFocus = () => setIsActive(true);
    const handleBlur = () => setIsActive(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIsActive(true)
        setInputValue(e.target.value)
    };

    const filteredOptions = options?.filter((item) =>
        item.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div>
            <label htmlFor={id}>
                {label}
            </label>
            <input className="border border-black"
                disabled={loading || defaultValue !== "ADMIN"}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={inputValue}
                {...register?.(registrationKey || id)}
                id={id}
            />
            <ul>
                {isActive && filteredOptions
                    .map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
            </ul>
        </div>
    );
}