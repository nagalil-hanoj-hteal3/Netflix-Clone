import { motion } from 'framer-motion';
import { Film, Tv, Gamepad, Popcorn } from 'lucide-react';

const TrailerLoadingScreen = () => {
  const loadingIcons = [
    { Icon: Popcorn, color: 'text-yellow-400' },
    { Icon: Gamepad, color: 'text-teal-400' },
    { Icon: Film, color: 'text-blue-400' },
    { Icon: Tv, color: 'text-purple-400' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      <div className="flex space-x-4 mb-8">
        {loadingIcons.map(({ Icon, color }, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.5, opacity: 0.5 }}
            animate={{ 
              scale: [0.5, 1.2, 1], 
              opacity: [0.5, 1, 0.5],
              y: [0, -20, 0] 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          >
            <Icon className={`size-8 ${color}`} />
          </motion.div>
        ))}
      </div>

      <h2 className="text-3xl font-bold mb-4">TrailoHub</h2>
      
      <p className="mb-8">Loading your entertainment realm...</p>

      <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ 
            duration: 2, 
            ease: "linear",
            repeat: Infinity 
          }}
        />
      </div>
    </div>
  );
};

export default TrailerLoadingScreen;