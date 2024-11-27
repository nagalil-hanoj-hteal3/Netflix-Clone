import { motion } from 'framer-motion';
import { Clapperboard, Film, Camera, Circle } from 'lucide-react';

const HomeScreenLoader = () => {
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

  const backgroundCircleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      rotate: [0, 360],
      scale: [0.8, 1.2, 1],
      opacity: [0.2, 0.5, 0.2],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 40, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10
      }
    }
  };

  return (
    <div className="h-screen bg-gradient-to-tr from-slate-950 via-blue-950 to-slate-900 
                    flex items-center justify-center overflow-hidden relative">
      {/* Subtle Background Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div 
          key={i}
          className="absolute bg-blue-500/10 rounded-full"
          style={{
            width: Math.random() * 20 + 10,
            height: Math.random() * 20 + 10,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0],
            scale: [0, 1, 0],
            transition: {
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }
          }}
        />
      ))}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-8 z-10 relative"
      >
        {/* Animated Icons */}
        <motion.div 
          variants={containerVariants}
          className="flex justify-center mb-6 space-x-4"
        >
          <motion.div variants={itemVariants} className="relative">
            <Film 
              className="w-16 h-16 text-blue-400 opacity-80" 
              strokeWidth={1.5} 
            />
            <motion.div
              variants={backgroundCircleVariants}
              animate="visible"
              className="absolute -top-2 -right-2 -z-10"
            >
              <Circle className="w-24 h-24 text-blue-500/30" />
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <Clapperboard 
              className="w-16 h-16 text-red-400 opacity-80" 
              strokeWidth={1.5} 
            />
            <motion.div
              variants={backgroundCircleVariants}
              animate="visible"
              className="absolute -bottom-2 -left-2 -z-10"
            >
              <Circle className="w-24 h-24 text-red-500/30" />
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <Camera 
              className="w-16 h-16 text-green-400 opacity-80" 
              strokeWidth={1.5} 
            />
            <motion.div
              variants={backgroundCircleVariants}
              animate="visible"
              className="absolute -top-2 -left-2 -z-10"
            >
              <Circle className="w-24 h-24 text-green-500/30" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Loading Text */}
        <motion.h1 
          variants={itemVariants}
          className="text-4xl font-bold text-white/90 tracking-wide"
        >
          Curating Your Entertainment
        </motion.h1>

        {/* Progress Indicator */}
        <motion.div 
          variants={itemVariants}
          className="h-1.5 w-72 mx-auto bg-blue-900/40 rounded-full overflow-hidden"
        >
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ 
              x: ['0%', '100%', '200%'],
              opacity: [1, 0.7, 0.3, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut"
            }}
            className="h-full w-1/3 bg-gradient-to-r from-blue-600/20 via-blue-600 to-blue-600/20 rounded-full"
          />
        </motion.div>

        {/* Loading Text Animation */}
        <motion.p 
          variants={itemVariants}
          className="text-gray-400 text-lg flex items-center justify-center"
        >
          <span className="mr-2">Preparing Your Stream</span>
          <motion.span
            animate={{
              opacity: [1, 0.3, 1],
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

export default HomeScreenLoader;