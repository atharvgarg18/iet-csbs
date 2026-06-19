import { motion } from 'framer-motion';

export default function GridBackground() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none perspective-[1000px] flex items-center justify-center">
            {/* Dark gradient fade for the edges */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10" />

            {/* Moving Grid Floor */}
            <motion.div
                className="w-[200vw] h-[200vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(0, 240, 255, 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '100px 100px',
                    rotateX: '75deg',
                }}
                animate={{
                    backgroundPosition: ['0px 0px', '0px 100px'],
                }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 2
                }}
            />

            {/* Glowing Orb in Center */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] mix-blend-screen z-0"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut"
                }}
            />
        </div>
    );
}
