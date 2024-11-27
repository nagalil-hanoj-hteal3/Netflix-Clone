import { motion } from 'framer-motion';
import { Film, Clapperboard, Star, Play } from 'lucide-react';

const AuthLoadingScreen = () => {
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
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 
                    flex items-center justify-center overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-8"
      >
        <motion.div 
          variants={iconVariants}
          animate="animate"
          className="flex justify-center mb-6 space-x-4"
        >
          <Film className="w-16 h-16 text-blue-400" strokeWidth={1.5} />
          <Clapperboard className="w-16 h-16 text-red-400" strokeWidth={1.5} />
          <Star className="w-16 h-16 text-yellow-400" strokeWidth={1.5} />
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-4xl font-bold text-white tracking-wide"
        >
          Preparing Your Cinematic Experience
        </motion.h1>

        <motion.div 
          variants={itemVariants}
          className="flex justify-center space-x-4"
        >
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ 
              rotate: [0, 360],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          >
            <Play className="w-12 h-12 text-green-400" strokeWidth={2} />
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
          className="text-gray-400 text-lg flex items-center justify-center"
        >
          <span className="mr-2">Authenticating</span>
          <motion.span
            animate={{
              opacity: [1, 0.5, 1],
              transition: {
                duration: 1.5,
                repeat: Infinity
              }
            }}
          >
            ...
          </motion.span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AuthLoadingScreen;