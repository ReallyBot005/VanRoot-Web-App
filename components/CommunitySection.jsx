import React from 'react';

const CommunitySection = () => {
    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <h2 style={styles.title}>Community media</h2>
                <div style={styles.grid}>
                    {/* Placeholders for social media/community content */}
                    <div className="community-box" style={styles.box}></div>
                    <div className="community-box" style={styles.box}></div>
                    <div className="community-box" style={styles.box}></div>
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        minHeight: '100vh',
        backgroundColor: '#A98C5A', // Meghalaya Community Background
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
        fontFamily: "'Hind', sans-serif",
        fontSize: 'clamp(1.5rem, 4vw, 3rem)',
        color: '#2A2218',
        marginBottom: '60px',
        fontWeight: '600',
        letterSpacing: '2px',
        textTransform: 'lowercase', // Matches wireframe visual style
    },
    grid: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        flexWrap: 'wrap',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
    },
    box: {
        width: '320px',
        height: '450px',
        backgroundColor: '#F5EFE2', // Card background
        borderRadius: '4px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        border: '1px solid rgba(0,0,0,0.05)',
    }
};

// Add hover effect
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style")
    styleSheet.innerText = `
        .community-box:hover {
            transform: translateY(-15px) scale(1.02);
            background-color: #3F5E45 !important;
            color: #F8F7F2 !important;
            box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
        }
    `
    document.head.appendChild(styleSheet)
}

export default CommunitySection;
