import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Zap, Sparkles, Coffee, Code } from 'lucide-react';
import { Card } from '@/components/ui/card';

const AboutPage = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get your meme match in seconds with our AI-powered algorithm"
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Advanced machine learning finds the perfect template for your vibe"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by Gen Z, for Gen Z - we understand meme culture"
    },
    {
      icon: Heart,
      title: "Made with Love",
      description: "Every pixel crafted with passion and lots of caffeine"
    }
  ];

  const team = [
    {
      name: "The Gen Z Squad",
      role: "Developers & Meme Enthusiasts",
      description: "A group of passionate developers who live and breathe meme culture"
    }
  ];

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
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-poppins font-black mb-6"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #14B8A6)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              animation: 'gradient-shift 3s ease infinite'
            }}
          >
            About Roastly
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 font-inter mb-4"
            variants={itemVariants}
          >
            Your pic is giving <span className="text-neon-pink font-bold">main character</span> energy ✨
          </motion.p>
          <motion.p 
            className="text-lg text-gray-400 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            We're on a mission to help you find your perfect meme template and become iconic. 
            Built by Gen Z, for Gen Z - because we understand that memes aren't just jokes, 
            they're a language. 🚀
          </motion.p>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-3xl font-poppins font-bold text-center mb-12 text-white"
            variants={itemVariants}
          >
            Why Timeless? 🤔
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="genz-card p-6 text-center h-full">
                    <Icon className="w-12 h-12 text-neon-purple mx-auto mb-4" />
                    <h3 className="text-xl font-poppins font-semibold mb-3 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Mission Section */}
        <motion.div 
          className="mb-16"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="genz-card p-8 md:p-12 text-center">
            <motion.div
              className="max-w-4xl mx-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-3xl font-poppins font-bold mb-6 text-white">
                Our Mission 🎯
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                In a world where everyone's trying to be the main character, we believe your photos 
                deserve to be iconic. Timeless uses cutting-edge AI to analyze your photos and match 
                them with the perfect meme template from our curated collection.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Whether you're giving <span className="text-neon-pink font-bold">distracted boyfriend</span> energy, 
                having a <span className="text-neon-teal font-bold">woman yelling at cat</span> moment, or just 
                living your best <span className="text-neon-purple font-bold">this is fine</span> life - 
                we've got the perfect template for your vibe.
              </p>
            </motion.div>
          </Card>
        </motion.div>

        {/* Team Section */}
        <motion.div 
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-3xl font-poppins font-bold text-center mb-12 text-white"
            variants={itemVariants}
          >
            Meet the Squad 👥
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="genz-card p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-neon-purple to-neon-pink rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">👨‍💻</span>
                  </div>
                  <h3 className="text-xl font-poppins font-semibold mb-2 text-white">
                    {member.name}
                  </h3>
                  <p className="text-neon-purple font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {member.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div 
          className="mb-16"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="genz-card p-8 text-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-3xl font-poppins font-bold mb-6 text-white">
                Built With Modern Tech ⚡
              </h2>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'AI/ML', 'Vite'].map((tech) => (
                  <span 
                    key={tech}
                    className="bg-dark-border text-gray-300 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-gray-400">
                Plus lots of <Coffee className="w-4 h-4 inline mx-1" /> and <Code className="w-4 h-4 inline mx-1" />
              </p>
            </motion.div>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="genz-card p-8 max-w-2xl mx-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-3xl font-poppins font-bold mb-4 text-white">
              Ready to Become Iconic? 🚀
            </h2>
            <p className="text-gray-300 mb-6">
              Upload your photo and let our AI find your perfect meme template!
            </p>
            <motion.button
              className="genz-button text-lg px-8 py-4 h-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/'}
            >
              Start Creating Memes
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
