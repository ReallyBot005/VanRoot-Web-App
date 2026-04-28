import React from 'react';

const MapSection = () => {
    return (
        <section style={styles.section} id="react-map">
            <div style={styles.container}>
                <h2 style={styles.title}>3D MAP</h2>
                <div style={styles.placeholder}>
                    <p style={styles.placeholderText}>[ Interactive 3D Terrain Map Integration ]</p>
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        minHeight: '100vh',
        backgroundColor: '#D8D6D1', // Meghalaya Map Background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 100,
        padding: '100px 0',
    },
    container: {
        textAlign: 'center',
        width: '100%',
    },
    title: {
        fontFamily: "'Cinzel', serif",
        fontSize: 'clamp(2rem, 5vw, 4rem)',
        color: '#111111',
        marginBottom: '40px',
        letterSpacing: '8px',
        textTransform: 'uppercase',
    },
    placeholder: {
        width: '90%',
        maxWidth: '1200px',
        height: '60vh',
        margin: '0 auto',
        backgroundColor: 'rgba(90, 107, 82, 0.05)', // Using #5A6B52 with alpha
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(5px)',
    },
    placeholderText: {
        color: '#4E7C8A', // New Map slate blue accent color
        fontFamily: "'Hind', sans-serif",
        letterSpacing: '1px',
    }
};

export default MapSection;
