import React from "react";
import { motion } from "framer-motion/dist/framer-motion";
import { Link } from "react-router-dom";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
};

export const MenuItem = ({ item, toggle }) => {
  return (
    <motion.li variants={variants}>
      <Link 
        to={item.path}
        className="nav-text-title"
        onClick={toggle}
      >
        {item.icon} {item.name}
      </Link>
    </motion.li>
  );
};
