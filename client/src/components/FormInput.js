import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormHelperText from '@mui/material/FormHelperText';

function FormInput(props) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = props.type === 'password';

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const getInputType = () => {
    if (!isPasswordField) return props.type;
    return showPassword ? 'text' : 'password';
  };

  return (
    <FormControl
      fullWidth
      required={props.required}
      variant="outlined"
      size="small"
      sx={{
        '& .MuiInputLabel-root': {
          color: 'gray', // inactive label
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'gray', // active label
        },
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: 'black', // hover outline
          },
          '&.Mui-focused fieldset': {
            borderColor: 'black', // outline in focus
          },
        },
        '& .MuiInputAdornment-root .MuiIconButton-root': {
          color: 'black' // icons (password eye)
        },
        '& .MuiFormHelperText-root': {
          color: 'red' 
        }
      }}
      error={!!props.error} // Convert error to boolean
    >
      <InputLabel htmlFor={props.name}>{props.label}</InputLabel>
      <OutlinedInput
        id={props.name}
        type={getInputType()}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        autoComplete={props.autoComplete}
        endAdornment={
          isPasswordField && (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} edge="end">
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          )
        }
        label={props.label}
      />
      {props.error && (
        <FormHelperText>{props.error}</FormHelperText> // Display error message
      )}

    </FormControl>
  );
}

export default FormInput;
