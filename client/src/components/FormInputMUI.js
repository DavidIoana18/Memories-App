    import React from 'react';
    import {TextField, InputAdornment, Box} from '@mui/material';

    function FormInputMUI( {type, name, value, onChange, placeholder, required, multiline = false, rows = 1, error, helperText, maxLength} ){
        return(
            <Box>
                <TextField
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    fullWidth
                    variant="outlined"
                    multiline={multiline}
                    rows={multiline ? rows : 1}
                    error={error}
                    helperText={helperText}
                    slotProps={{
                        input: {
                            endAdornment: maxLength ? (
                                <InputAdornment position="end">
                                    <span
                                        style={{
                                            color: value.length === maxLength ? 'red' : 'gray', // text is red when maxLength is reached
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        {value.length}/{maxLength} characters
                                    </span>
                                </InputAdornment>
                            ) : null,
                        }
                    }}
                />
            </Box>
        );
    }
    export default FormInputMUI;
    
