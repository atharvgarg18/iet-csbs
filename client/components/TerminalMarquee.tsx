import { motion } from 'framer-motion';

export default function TerminalMarquee() {
    const text = "[ SYS.MSG ] ADMISSIONS OPEN FOR 2026-27 // NOTE: CURRICULUM V2 UPDATING THIS YEAR // SECURE YOUR SEAT // ADMISSIONS CONDUCTED VIA DTE BHOPAL // 100% JEE MAIN MERIT BASED // ";

    return (
        <div className="w-full bg-primary text-black py-3 overflow-hidden flex items-center border-y border-border z-20 relative">
            <motion.div
                className="flex whitespace-nowrap"
                animate={{
                    x: [0, -1000],
                }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 15
                }}
            >
                {/* Repeat text multiple times to ensure seamless infinite scroll */}
                {[...Array(5)].map((_, i) => (
                    <span key={i} className="font-syne font-bold uppercase tracking-widest text-sm mx-4">
                        {text}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
