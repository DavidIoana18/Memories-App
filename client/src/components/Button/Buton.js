import React from 'react';
import styles from './Button.module.css';

function Button( {type = "button", onClick = () => {}, name = "Button", className = "", children} ) {
    return(
        <button 
            className={ `${styles.button} ${className}`} 
            type={type} 
            onClick={onClick}
        >   
         {children || name}
        </button>
    );
}

export default Button;