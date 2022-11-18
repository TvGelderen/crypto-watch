import React from "react";
import { motion } from "framer-motion/dist/framer-motion";
import { MenuItem } from "./MenuItem";
import { MenuData } from "../MenuData";

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

export const Navigation = ({ toggle }) => (
  <motion.ul variants={variants} style={{marginTop: 75}}>
    {MenuData.map(item => (
      <MenuItem item={item} toggle={toggle} key={item.name} />
    ))}
  </motion.ul>
);