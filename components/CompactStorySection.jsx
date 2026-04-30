import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence, useAnimation } from 'framer-motion';

const PremiumWord = ({ text, type }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isProximity, setIsProximity] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const ref = useRef(null);
    const idleControls = useAnimation();

    const isMeaningful = type === 'meaningful';
    const accentColor = isMeaningful ? '#C98A3D' : '#3F5E45';

    // Magnetic physics
    const springConfig = { damping: 25, stiffness: 150 };
    const translateX = useSpring(mouseX, springConfig);
    const translateY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
            
            if (dist < 180) {
                setIsProximity(true);
                const moveX = (e.clientX - centerX) * 0.03;
                const moveY = (e.clientY - centerY) * 0.03;
                mouseX.set(Math.min(Math.max(moveX, -3), 3));
                mouseY.set(Math.min(Math.max(moveY, -3), 3));
            } else {
                setIsProximity(false);
                mouseX.set(0);
                mouseY.set(0);
            }
        };
        window.addEventListener('mousemove', handleGlobalMouseMove);
        return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
    }, []);

    // Idle Animation
    useEffect(() => {
        const interval = setInterval(async () => {
            if (isHovered) return;
            await idleControls.start({
                opacity: 0.8,
                scale: 1.02,
                transition: { duration: 2, ease: "easeInOut" }
            });
            await idleControls.start({
                opacity: 1,
                scale: 1,
                transition: { duration: 2, ease: "easeInOut" }
            });
        }, 8000);
        return () => clearInterval(interval);
    }, [isHovered, idleControls]);

    const letters = text.split('');

    return (
        <motion.span
            ref={ref}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                x: translateX,
                y: translateY,
                display: 'inline-block',
                position: 'relative',
                cursor: 'pointer',
                padding: '0 2px',
                verticalAlign: 'bottom'
            }}
        >
            {/* Background Glow */}
            <AnimatePresence>
                {(isHovered || isProximity) && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                            opacity: isHovered ? 0.7 : 0.3, 
                            scale: isHovered ? 1.4 : 1.1,
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{
                            position: 'absolute',
                            top: '50%', left: '50%',
                            width: '150%', height: '150%',
                            background: `radial-gradient(circle, ${accentColor}33 0%, transparent 70%)`,
                            filter: 'blur(20px)',
                            transform: 'translate(-50%, -50%)',
                            zIndex: -1,
                            pointerEvents: 'none',
                        }}
                    />
                )}
            </AnimatePresence>

            {/* The Text Container */}
            <motion.span
                animate={idleControls}
                style={{
                    display: 'inline-flex',
                    position: 'relative',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    color: accentColor,
                    fontSize: '1.05em',
                }}
            >
                {letters.map((char, i) => (
                    <motion.span
                        key={i}
                        initial={false}
                        animate={isHovered ? {
                            y: isMeaningful ? -4 : [0, 4, -2, 0],
                            scale: isMeaningful ? 1.05 : 1.08,
                            opacity: 1,
                            filter: 'blur(0px)',
                            letterSpacing: isMeaningful ? '0.04em' : '0.02em',
                            transition: { 
                                delay: isMeaningful ? 0 : i * 0.04,
                                duration: 0.5,
                                ease: [0.16, 1, 0.3, 1]
                            }
                        } : {
                            y: 0,
                            scale: 1,
                            opacity: 1,
                            filter: 'blur(0px)',
                            letterSpacing: '0em',
                            transition: { duration: 0.4 }
                        }}
                        style={{ display: 'inline-block', position: 'relative' }}
                    >
                        {char}
                    </motion.span>
                ))}

                {/* Light Shimmer Effect Layer */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.span
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{ x: '100%', opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            style={{
                                position: 'absolute',
                                top: 0, left: 0, width: '100%', height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                                mixBlendMode: 'overlay',
                                pointerEvents: 'none',
                                zIndex: 5,
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* Underline for moment */}
                {!isMeaningful && (
                    <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        style={{
                            position: 'absolute',
                            bottom: 0, left: 0, width: '100%', height: '1.5px',
                            background: accentColor,
                            originX: 0,
                            opacity: 0.8
                        }}
                    />
                )}
            </motion.span>
        </motion.span>
    );
};

const CompactStorySection = () => {
    const sectionRef = useRef(null);
    const bgX = useMotionValue(50);
    const bgY = useMotionValue(50);

    const handleMouseMove = (e) => {
        if (!sectionRef.current) return;
        const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        bgX.set(x);
        bgY.set(y);
    };

    const background = useTransform(
        [bgX, bgY],
        ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, #F7F4EE 0%, #EFEBE3 50%, #E5E1D8 100%)`
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.2,
                delayChildren: 0.2,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
        visible: { 
            opacity: 1, 
            y: 0, 
            filter: 'blur(0px)',
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <motion.section 
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            style={{ ...styles.section, background }}
            id="react-editorial"
        >
            <motion.div 
                style={styles.container}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
            >
                <div style={styles.headerGroup}>
                    <motion.h2 style={styles.title} variants={itemVariants}>
                        Why <PremiumWord text="meaningful" type="meaningful" /> <strong>journeys</strong> <br /> 
                        live beyond the <PremiumWord text="moment" type="moment" />
                    </motion.h2>
                    
                    <motion.p style={styles.subtitle} variants={itemVariants}>
                        The finest places are not only visited. <br />
                        They are remembered through people, culture, and story.
                    </motion.p>
                </div>

                <motion.div variants={itemVariants} style={styles.ctaGroup}>
                    <a href="#" style={styles.cta}>
                        EXPLORE MEGHALAYA ›
                        <div style={styles.ctaUnderline}></div>
                    </a>
                </motion.div>
            </motion.div>
        </motion.section>
    );
};

const styles = {
    section: {
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 10%',
        zIndex: 100,
        overflow: 'hidden',
    },
    container: {
        position: 'relative',
        zIndex: 5,
        maxWidth: '1200px',
        textAlign: 'center',
    },
    headerGroup: {
        marginBottom: '50px',
    },
    title: {
        fontFamily: "'Hind', sans-serif",
        fontSize: 'clamp(2rem, 4.5vw, 4rem)',
        color: '#161616',
        lineHeight: 1.3,
        fontWeight: 400,
        marginBottom: '32px',
        letterSpacing: '-0.02em',
    },
    subtitle: {
        fontFamily: "'Hind', sans-serif",
        fontSize: 'clamp(1rem, 1.2vw, 1.4rem)',
        color: '#6E6E6E',
        lineHeight: 1.6,
        fontWeight: 300,
        maxWidth: '700px',
        margin: '0 auto',
    },
    ctaGroup: {
        marginTop: '50px',
    },
    cta: {
        display: 'inline-block',
        color: '#161616',
        textDecoration: 'none',
        fontFamily: "'Hind', sans-serif",
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        letterSpacing: '5px',
        fontWeight: 600,
        position: 'relative',
        paddingBottom: '8px',
    },
    ctaUnderline: {
        position: 'absolute',
        bottom: 0, left: 0, width: '100%', height: '2px',
        backgroundColor: '#3F5E45',
        transformOrigin: 'left',
        transform: 'scaleX(0)',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    }
};

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style")
    styleSheet.innerText = `
        #react-editorial a:hover div {
            transform: scaleX(1) !important;
        }
        #react-editorial a:hover {
            color: #3F5E45 !important;
        }
        #react-editorial strong {
            font-weight: 700;
            color: #161616;
        }
        #react-editorial h2 {
            display: block;
            width: 100%;
        }
    `
    document.head.appendChild(styleSheet)
}

export default CompactStorySection;
