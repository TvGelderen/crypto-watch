import { motion, AnimatePresence } from 'framer-motion/dist/framer-motion'
import React, { useState } from 'react'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'
import { Link } from 'react-router-dom'

import '../css/style.css'
import { MenuData } from './MenuData'

const Navbar = () => {
  const [open, setOpen] = useState(false)

  const toggleOpen = () => setOpen(!open)

  return (
    <div className='nav-container'>
      <h1 className='py-3 text-center'>Crypto Watch</h1>

      <div className='menu' onClick={toggleOpen}>
        <AiOutlineMenu size={28} />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div 
            className='nav-bar'
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={{
              hidden: {
                x: -320,
                transition: { duration: 0.5 }
              },
              visible: {
                x: 0,
                transition: { duration: 0.5 }
              },
            }}
          >
            <div className='nav-head'>
              <h5 className='p-3'>Crypto Watch</h5>
              <div className='close-button' onClick={toggleOpen}>
                <AiOutlineClose size={20} />
              </div>
            </div>
            <ul>
              {MenuData.map(item => (
                <li>
                  <Link to={item.path} className='nav-item'>
                    {item.icon} {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Navbar
