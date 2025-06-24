// src/components/Navbar.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <div className="relative z-10 bg-gradient-to-r from-[#0A4958] via-[#0A5866] to-[#0A6578] py-4 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-center md:justify-start">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <img
            src="https://storage.googleapis.com/cluvi/Imagenes/logo_avance_blanco.png"
            alt="Avance Seguros"
            className="h-12 md:h-16 drop-shadow-md"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Navbar;