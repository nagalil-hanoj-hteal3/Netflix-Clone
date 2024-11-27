import { motion } from 'framer-motion';
import { Film, Star, Clapperboard, Popcorn } from 'lucide-react';

const CreativeLoadingScreen = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const iconVariants = {
    rotate: {
      rotate: [0, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 
                    flex items-center justify-center overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-8"
      >
        <motion.div 
          variants={iconVariants}
          animate="rotate"
          className="flex justify-center mb-6"
        >
          <Film className="w-24 h-24 text-blue-400" strokeWidth={1} />
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-4xl font-bold text-white tracking-wide"
        >
          Loading Details
        </motion.h1>

        <motion.div 
          variants={itemVariants}
          className="flex justify-center space-x-4"
        >
          <motion.div 
            variants={iconVariants}
            animate="rotate"
            className="text-yellow-400"
          >
            <Star className="w-8 h-8" />
          </motion.div>
          <motion.div 
            variants={iconVariants}
            animate="rotate"
            className="text-red-400"
          >
            <Clapperboard className="w-8 h-8" />
          </motion.div>
          <motion.div 
            variants={iconVariants}
            animate="rotate"
            className="text-green-400"
          >
            <Popcorn className="w-8 h-8" />
          </motion.div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="h-1 w-64 mx-auto bg-blue-600/30 overflow-hidden"
        >
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear"
            }}
            className="h-full w-1/3 bg-blue-600"
          />
        </motion.div>

        <motion.p 
          variants={itemVariants}
          className="text-gray-400 text-lg"
        >
          Gathering cinematic insights...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default CreativeLoadingScreen;