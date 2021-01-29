import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string
    label: string
    placeholder: string
    textarea?: boolean
}

export const InputField: React.FC<InputFieldProps> = ({ label, textarea, size: _, ...props }) => {
    const [field, { error }] = useField(props)

    if (textarea) {
        return (
            <FormControl isInvalid={!!error}>
                <FormLabel htmlFor={field.name}>{label}</FormLabel>
                <Textarea {...field} id={field.name} placeholder={props.placeholder} type={props.type} />
                {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
            </FormControl>
        )
    } else {
        return (
            <FormControl isInvalid={!!error}>
                <FormLabel htmlFor={field.name}>{label}</FormLabel>
                <Input {...field} id={field.name} placeholder={props.placeholder} type={props.type} />
                {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
            </FormControl>
        );
    }
}
