import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Sparkles, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import memeApiService from '@/lib/memeApi';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleCameraClick = () => {
    setIsLoading(true);
    // Simulate camera processing
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Camera Ready! 📸",
        description: "Let's snap some spicy memes!",
        variant: "default"
      });
      // Navigate to camera component or show camera interface
    }, 2000);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsLoading(true);
      
      try {
        // Use mock API for demo
        const result = await memeApiService.mockMemeMatch(file);
        
        // Store result in session storage for results page
        sessionStorage.setItem('memeResult', JSON.stringify(result));
        
        setIsLoading(false);
        toast({
          title: "Meme Match Found! 🎯",
          description: "Your pic is giving main character energy!",
          variant: "default"
        });
        
        // Navigate to results page
        navigate('/results');
      } catch (error) {
        setIsLoading(false);
        toast({
          title: "Oops! Something went wrong",
          description: "Please try again with a different photo",
          variant: "destructive"
        });
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      rotate: [0, -1, 1, -1, 0],
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neon-purple/10 via-transparent to-neon-pink/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-neon-teal/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo and Title */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-poppins font-black mb-4"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #14B8A6)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              animation: 'gradient-shift 3s ease infinite'
            }}
          >
            Timeless
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl font-inter font-medium text-gray-300 mb-2"
            variants={itemVariants}
          >
            Your pic is giving <span className="text-neon-pink font-bold">main character</span> energy ✨
          </motion.p>
          <motion.p 
            className="text-lg font-comic-neue text-gray-400"
            variants={itemVariants}
          >
            Find your perfect meme template and become iconic
          </motion.p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 mb-12"
          variants={itemVariants}
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={handleCameraClick}
              disabled={isLoading}
              className="genz-button text-lg px-8 py-6 h-auto min-w-[200px] flex items-center gap-3"
            >
              <Camera className="w-6 h-6" />
              📸 Snap a Pic
            </Button>
          </motion.div>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={handleUploadClick}
              disabled={isLoading}
              className="genz-button text-lg px-8 py-6 h-auto min-w-[200px] flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, #14B8A6, #06B6D4)',
                boxShadow: '0 4px 15px rgba(20, 184, 166, 0.4)'
              }}
            >
              <Upload className="w-6 h-6" />
              ⬆️ Upload
            </Button>
          </motion.div>
        </motion.div>

        {/* Hidden file input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileSelect}
        />

        {/* Loading Screen */}
        {isLoading && (
          <motion.div 
            className="fixed inset-0 bg-dark-bg/95 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                🔥
              </motion.div>
              <motion.h2 
                className="loading-text text-3xl font-bold mb-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Cooking up some spicy memes
              </motion.h2>
              <motion.p 
                className="text-gray-400 text-lg"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                This is about to be iconic...
              </motion.p>
            </motion.div>
          </motion.div>
        )}

        {/* Features Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="genz-card p-6 text-center">
              <Sparkles className="w-12 h-12 text-neon-purple mx-auto mb-4" />
              <h3 className="text-xl font-poppins font-semibold mb-2">AI-Powered Matching</h3>
              <p className="text-gray-400">Our algorithm finds the perfect meme template for your vibe</p>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="genz-card p-6 text-center">
              <Zap className="w-12 h-12 text-neon-pink mx-auto mb-4" />
              <h3 className="text-xl font-poppins font-semibold mb-2">Instant Results</h3>
              <p className="text-gray-400">Get your meme match in seconds, not minutes</p>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="genz-card p-6 text-center">
              <Heart className="w-12 h-12 text-neon-teal mx-auto mb-4" />
              <h3 className="text-xl font-poppins font-semibold mb-2">Share Everywhere</h3>
              <p className="text-gray-400">Post to Instagram, WhatsApp, X, and more</p>
            </Card>
          </motion.div>
        </motion.div>

        {/* Bottom Text */}
        <motion.div 
          className="text-center mt-12"
          variants={itemVariants}
        >
          <p className="text-gray-500 text-sm font-inter">
            Made with ❤️ by Gen Z for Gen Z
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
