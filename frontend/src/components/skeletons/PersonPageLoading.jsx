import { motion } from 'framer-motion';
import { User, Film } from 'lucide-react';

const PersonPageLoading = () => {
    // Variants for container animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
            delayChildren: 0.2,
            staggerChildren: 0.1
            }
        }
    };

    // Variants for individual card animations
    const cardVariants = {
        hidden: { 
        opacity: 0, 
        scale: 0.9,
        y: 20 
        },
        visible: { 
        opacity: 1, 
        scale: 1,
        y: 0,
        transition: {
            duration: 0.5,
            type: "spring",
            stiffness: 100
        }
        },
        hover: {
        scale: 1.05,
        boxShadow: "0px 10px 20px rgba(59, 130, 246, 0.3)",
        transition: { duration: 0.3 }
        }
    };

    // Pulse animation for loading indicator
    const pulseVariants = {
        animate: {
        scale: [1, 1.1, 1],
        opacity: [0.6, 1, 0.6],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
        }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="container mx-auto px-4 py-8 max-w-7xl"
            >
                <motion.div 
                className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/50 p-6 shadow-2xl shadow-blue-900/20"
                >
                    <motion.h1 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl font-bold text-white mb-8 flex items-center"
                    >
                        <User className="mr-4 text-blue-400" />
                        Loading Popular Actors
                    </motion.h1>

                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((card) => (
                            <motion.div
                                key={card}
                                variants={cardVariants}
                                whileHover="hover"
                                className="bg-slate-900/60 rounded-xl overflow-hidden 
                                border border-slate-800/50 shadow-lg 
                                cursor-wait relative"
                            >
                                {/* Skeleton Image */}
                                <motion.div 
                                variants={pulseVariants}
                                animate="animate"
                                className="w-full h-[400px] bg-slate-800 
                                    flex items-center justify-center text-slate-400"
                                >
                                    <Film className="size-12 text-slate-600" />
                                </motion.div>

                                <div className="p-4">
                                {/* Skeleton Text */}
                                    <motion.div 
                                        variants={pulseVariants}
                                        animate="animate"
                                        className="h-6 bg-slate-800 rounded w-3/4 mb-4"
                                    />
                                
                                    <div className="space-y-2 mb-2">
                                        {/* Skeleton Details */}
                                        <motion.div 
                                        variants={pulseVariants}
                                        animate="animate"
                                        className="h-4 bg-slate-800 rounded w-1/2 mb-2"
                                        />
                                        <motion.div 
                                        variants={pulseVariants}
                                        animate="animate"
                                        className="h-4 bg-slate-800 rounded w-1/2"
                                        />
                                    </div>

                                    {/* Skeleton Popularity Bar */}
                                    <motion.div 
                                        variants={pulseVariants}
                                        animate="animate"
                                        className="w-full bg-slate-800 rounded-full h-2.5 mt-4"
                                    />
                                </div>
                            </motion.div>
                         ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PersonPageLoading;