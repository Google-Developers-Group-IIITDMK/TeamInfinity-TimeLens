import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Grid, Info, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/make-meme', label: 'Make Meme', icon: Camera },
    { path: '/templates', label: 'Templates', icon: Grid },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                className="w-10 h-10 rounded-full genz-gradient flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-white font-bold text-lg">T</span>
              </motion.div>
              <span className="text-2xl font-poppins font-black bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
                Timeless
              </span>
            </Link>
          </motion.div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`px-4 py-2 rounded-full transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-lg' 
                          : 'text-gray-300 hover:text-white hover:bg-dark-card'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <motion.div
            className="md:hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white"
            >
              <Grid className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <motion.div 
          className="md:hidden mt-4 pt-4 border-t border-dark-border"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`px-3 py-2 rounded-full text-sm transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-dark-card'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
