import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, ArrowLeft, Heart, MessageCircle, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { MemeMatchResult } from '@/lib/memeApi';

const ResultsPage = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [memeResult, setMemeResult] = useState<MemeMatchResult | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get meme result from session storage
    const storedResult = sessionStorage.getItem('memeResult');
    if (storedResult) {
      setMemeResult(JSON.parse(storedResult));
    } else {
      // If no result found, redirect to home
      navigate('/');
    }
  }, [navigate]);

  if (!memeResult) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-poppins font-bold mb-4">No meme result found</h2>
          <Link to="/">
            <Button className="genz-button">Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    // In real app, this would download the meme
    console.log('Downloading meme...');
  };

  const handleShare = (platform: string) => {
    setIsSharing(true);
    // Simulate sharing
    setTimeout(() => {
      setIsSharing(false);
      console.log(`Sharing to ${platform}...`);
    }, 1000);
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-pink/5"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Link to="/">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
          >
            <h1 className="text-3xl font-poppins font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
              Your Meme Match! 🎯
            </h1>
          </motion.div>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </motion.div>

        <motion.div 
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Results */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
            variants={itemVariants}
          >
            {/* User Photo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="genz-card p-6 text-center">
                <h3 className="text-xl font-poppins font-semibold mb-4 text-neon-purple">Your Photo</h3>
                <div className="relative">
                  <img 
                    src={memeResult.userPhoto} 
                    alt="Your photo" 
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                </div>
              </Card>
            </motion.div>

            {/* Meme Template */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="genz-card p-6 text-center">
                <h3 className="text-xl font-poppins font-semibold mb-4 text-neon-pink">Perfect Match</h3>
                <div className="relative">
                  <img 
                    src={memeResult.memeTemplate.imageUrl} 
                    alt={memeResult.memeTemplate.name} 
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="meme-text text-lg text-center">
                      {memeResult.memeTemplate.name}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Caption and Confidence */}
          <motion.div 
            className="text-center mb-8"
            variants={itemVariants}
          >
            <motion.div
              className="genz-card p-6 mb-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-poppins font-bold mb-2 text-white">
                {memeResult.caption}
              </h2>
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <span>Confidence:</span>
                <span className="text-neon-green font-bold">{memeResult.confidence}%</span>
                <span className="text-2xl">🔥</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleDownload}
                className="genz-button text-lg px-8 py-4 h-auto flex items-center gap-3"
              >
                <Download className="w-5 h-5" />
                Download Meme
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => handleShare('general')}
                disabled={isSharing}
                className="genz-button text-lg px-8 py-4 h-auto flex items-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, #14B8A6, #06B6D4)',
                  boxShadow: '0 4px 15px rgba(20, 184, 166, 0.4)'
                }}
              >
                <Share2 className="w-5 h-5" />
                Share Everywhere
              </Button>
            </motion.div>
          </motion.div>

          {/* Social Share Buttons */}
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <h3 className="text-lg font-poppins font-semibold mb-4 text-gray-300">
              Share on Social Media
            </h3>
            <div className="flex justify-center gap-4">
              {[
                { name: 'Instagram', icon: Instagram, color: 'text-pink-400 hover:text-pink-300' },
                { name: 'Twitter', icon: Twitter, color: 'text-blue-400 hover:text-blue-300' },
                { name: 'WhatsApp', icon: MessageCircle, color: 'text-green-400 hover:text-green-300' },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <motion.button
                    key={social.name}
                    onClick={() => handleShare(social.name)}
                    disabled={isSharing}
                    className={`${social.color} p-3 rounded-full bg-dark-card hover:bg-dark-border transition-all duration-300`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Try Another Button */}
          <motion.div 
            className="text-center mt-12"
            variants={itemVariants}
          >
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white px-8 py-4 h-auto text-lg"
                >
                  Try Another Photo 📸
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage;
