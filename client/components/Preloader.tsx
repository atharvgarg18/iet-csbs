import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 500);
                    return 100;
                }
                // Random jump for a "glitchy/loading" feel
                return prev + Math.floor(Math.random() * 15) + 1;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background text-foreground"
                    initial={{ y: 0 }}
                    exit={{
                        y: '-100%',
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
                    }}
                >
                    <div className="w-full max-w-md px-8">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
                                System Initialization
                            </span>
                            <span className="text-5xl font-bold tracking-tighter text-primary">
                                {Math.min(progress, 100)}%
                            </span>
                        </div>
                        <div className="h-1 w-full bg-border overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: 'linear', duration: 0.1 }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
