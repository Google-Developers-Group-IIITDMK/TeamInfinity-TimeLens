import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, MessageCircle, Heart } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { 
      name: 'Instagram', 
      icon: Instagram, 
      href: 'https://instagram.com', 
      color: 'text-pink-400 hover:text-pink-300' 
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      href: 'https://twitter.com', 
      color: 'text-blue-400 hover:text-blue-300' 
    },
    { 
      name: 'WhatsApp', 
      icon: MessageCircle, 
      href: 'https://whatsapp.com', 
      color: 'text-green-400 hover:text-green-300' 
    },
  ];

  return (
    <motion.footer 
      className="bg-dark-bg border-t border-dark-border mt-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <motion.div 
            className="text-center md:text-left"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex items-center justify-center md:justify-start gap-2 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 rounded-full genz-gradient flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <span className="text-xl font-poppins font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
                Roastly
              </span>
            </motion.div>
            <p className="text-gray-400 text-sm mb-4">
              Your pic is giving main character energy ✨
            </p>
            <p className="text-gray-500 text-xs font-inter">
              Made with <Heart className="w-3 h-3 inline text-red-400" /> by Gen Z for Gen Z
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-poppins font-semibold mb-4 text-white">Quick Links</h3>
            <div className="space-y-2">
              {['Make Meme', 'Templates', 'About', 'Privacy Policy'].map((link) => (
                <motion.div
                  key={link}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-neon-purple text-sm transition-colors duration-300 block"
                  >
                    {link}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="text-center md:text-right"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-poppins font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex justify-center md:justify-end gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.color} transition-all duration-300`}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.a>
                );
              })}
            </div>
            <motion.p 
              className="text-gray-500 text-xs mt-4 font-inter"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              Share your memes and tag us! #TimelessMemes
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-dark-border mt-8 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500 text-sm font-inter">
            © 2024 Roastly. All rights reserved. | Built with React, Tailwind CSS, and lots of caffeine ☕
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
