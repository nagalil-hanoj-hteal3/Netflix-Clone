import { motion } from 'framer-motion';
import { Film, Tv, Camera, Clapperboard } from 'lucide-react';

const ActorPageLoading = () => {
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
                damping: 12,
                stiffness: 200
            }
        }
    };

    const iconVariants = {
        pulse: {
            scale: [1, 1.1, 1],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-900 to-black p-10 flex items-center justify-center">
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-center space-y-8"
            >
                <motion.div 
                    variants={itemVariants}
                    className="flex justify-center items-center space-x-4"
                >
                    <motion.div 
                        variants={iconVariants}
                        animate="pulse"
                        className="text-blue-300"
                    >
                        <Clapperboard size={64} strokeWidth={1.5} />
                    </motion.div>
                    <motion.h1 
                        className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
                        variants={itemVariants}
                    >
                        Loading Actor Details
                    </motion.h1>
                </motion.div>

                <motion.div 
                    variants={itemVariants}
                    className="flex justify-center space-x-6"
                >
                    <motion.div 
                        variants={iconVariants}
                        animate="pulse"
                        className="bg-slate-800/50 p-4 rounded-full"
                    >
                        <Film size={42} className="text-blue-400" strokeWidth={1.5} />
                    </motion.div>
                    <motion.div 
                        variants={iconVariants}
                        animate="pulse"
                        className="bg-slate-800/50 p-4 rounded-full"
                    >
                        <Tv size={42} className="text-green-400" strokeWidth={1.5} />
                    </motion.div>
                    <motion.div 
                        variants={iconVariants}
                        animate="pulse"
                        className="bg-slate-800/50 p-4 rounded-full"
                    >
                        <Camera size={42} className="text-purple-400" strokeWidth={1.5} />
                    </motion.div>
                </motion.div>

                <motion.div 
                    variants={itemVariants}
                    className="flex justify-center"
                >
                    <motion.div 
                        className="w-64 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ 
                            scaleX: 1,
                            transition: {
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                    />
                </motion.div>

                <motion.p 
                    variants={itemVariants}
                    className="text-xl text-blue-200 opacity-75"
                >
                    Gathering movies, TV shows, and images...
                </motion.p>
            </motion.div>
        </div>
    );
};

export default ActorPageLoading;