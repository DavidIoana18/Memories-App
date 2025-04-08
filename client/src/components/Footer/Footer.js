import React from "react";
import "./Footer.css"; 

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p>&copy; {year} 
        <span className="flash"> Flash</span>
         <span>Backs </span>
         - All rights reserved 
      </p>
    </footer>
  );
}

export default Footer;
