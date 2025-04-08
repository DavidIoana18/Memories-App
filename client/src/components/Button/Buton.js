import React from 'react';
import styles from './Button.module.css';

function Button( {type = "button", onClick = () => {}, name = "Button", className = ""} ) {
    return(
        <button 
            className={ `${styles.button} ${className}`} 
            type={type} 
            onClick={onClick}
        >   
         {name}
        </button>
    );
}

export default Button;