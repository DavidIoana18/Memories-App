    import React from 'react';
    import {TextField} from '@mui/material';

    function FormInputMUI( {type, name, value, onChange, placeholder, required, multiline = false, rows = 1, error, helperText} ){
        return(
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
            />
        );
    }
    export default FormInputMUI;
    
