import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, Heart, Star, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import memeApiService, { MemeTemplate } from '@/lib/memeApi';

const TemplatesPage = () => {
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const list = await memeApiService.getMemeTemplates();
      // Ensure uniqueness by id and limit to a reasonable number
      const map = new Map<string, MemeTemplate>();
      list.forEach(t => { if (!map.has(t.id)) map.set(t.id, t); });
      const unique = Array.from(map.values());
      if (mounted) setTemplates(unique);
    })();
    return () => { mounted = false; };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-pink/5"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-poppins font-black mb-4"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #14B8A6)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              animation: 'gradient-shift 3s ease infinite'
            }}
          >
            Roastly Templates
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 font-inter"
            variants={itemVariants}
          >
            Browse our collection of iconic meme templates 🔥
          </motion.p>
        </motion.div>

        {/* Templates Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {templates.map((template) => (
            <motion.div
              key={template.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="genz-card p-4 overflow-hidden">
                <div className="relative mb-4">
                  <img 
                    src={template.imageUrl} 
                    alt={template.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-dark-card/80 backdrop-blur-sm rounded-full px-2 py-1">
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 text-neon-yellow fill-current" />
                      <span className="text-white font-medium">{template.popularity}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-poppins font-semibold text-white">
                    {template.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 bg-dark-border px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-neon-pink p-2"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-neon-purple p-2"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-12"
          variants={itemVariants}
        >
          <motion.div
            className="genz-card p-8 max-w-2xl mx-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-poppins font-bold mb-4 text-white">
              Ready to Create Your Meme? 🚀
            </h2>
            <p className="text-gray-300 mb-6">
              Upload your photo and we'll find the perfect template match!
            </p>
            <Button
              className="genz-button text-lg px-8 py-4 h-auto"
              onClick={() => window.location.href = '/'}
            >
              <Grid className="w-5 h-5 mr-2" />
              Start Creating
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TemplatesPage;
