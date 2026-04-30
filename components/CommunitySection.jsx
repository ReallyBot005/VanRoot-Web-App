import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const POSTS = [
    { id: 1, user: 'Risha Nongrum', type: 'Local', image: '/laitlum_sunrise.png', caption: 'Foggy sunrise at Laitlum today 🌄 The canyon swallowed the mist whole.', location: 'Laitlum Canyon', likes: 412 },
    { id: 2, user: 'Arjun Mehta', type: 'Traveler', image: '/khasi_grandmother.png', caption: 'Grandmother cooking Khasi food over a wood fire. The warmth in this frame is real.', location: 'Mawlynnong', likes: 897 },
    { id: 3, user: 'Pynkhraw Dkhar', type: 'Local', image: '/dawki_waters.png', caption: 'Crystal waters of Dawki after the rain. The river turned into a mirror 💧', location: 'Dawki River', likes: 1243 },
    { id: 4, user: 'Neha Sharma', type: 'Traveler', image: '/shillong_market.png', caption: 'Local market colors in Shillong. Every stall is a painting waiting to happen 🎨', location: 'Shillong', likes: 563 },
    { id: 5, user: 'Baiakmenlang L.', type: 'Local', image: '/mawlynnong_village.png', caption: 'Morning walks in the cleanest village on Earth 🌿 Mawlynnong never gets old.', location: 'Mawlynnong', likes: 334 },
    { id: 6, user: 'Priya Khanna', type: 'Traveler', image: '/meghalaya_festival.png', caption: 'Nongkrem Dance Festival — tradition, rhythm, and color all at once ✨', location: 'Shillong', likes: 1876 },
];

// Camera SVG icon matching the warm green theme
const CameraIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

const PostCard = ({ post, index }) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <motion.div
            ref={ref}
            className={`c-card${post.isNew ? ' c-card--new' : ''}`}
            initial={{ opacity: 0, y: 48 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.72, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -14, scale: 1.022, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
        >
            {post.isNew && (
                <div className="c-card__new-badge">✦ Just Posted</div>
            )}
            <div className="c-card__img-wrap">
                <img src={post.image} alt={post.caption} className="c-card__img" />
                <div className="c-card__overlay">
                    <div className="c-card__overlay-inner">
                        <div className="c-card__location">📍 {post.location}</div>
                        <p className="c-card__caption">{post.caption}</p>
                        <div className="c-card__actions">
                            <button
                                className={`c-like${liked ? ' c-like--active' : ''}`}
                                onClick={() => { setLiked(l => !l); setLikes(n => liked ? n - 1 : n + 1); }}
                            >♡ {likes.toLocaleString()}</button>
                            <button className="c-action-btn">💬 Comment</button>
                            <button className="c-action-btn">↗ Share</button>
                            <button className="c-action-btn">🔖 Save</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="c-card__meta">
                <div className="c-card__avatar">{post.user.slice(0, 2).toUpperCase()}</div>
                <div>
                    <div className="c-card__username">{post.user}</div>
                    <span className={`c-badge c-badge--${post.type.toLowerCase()}`}>{post.type}</span>
                </div>
            </div>
        </motion.div>
    );
};

const UploadModal = ({ onClose, onPost }) => {
    const [caption, setCaption] = useState('');
    const [location, setLocation] = useState('');
    const [preview, setPreview] = useState(null);
    const [username, setUsername] = useState('');
    const [done, setDone] = useState(false);

    const handleFile = e => { const f = e.target.files[0]; if (f) setPreview(URL.createObjectURL(f)); };
    const handleSubmit = e => {
        e.preventDefault();
        if (preview) {
            onPost({
                id: Date.now(),
                user: username.trim() || 'Anonymous Explorer',
                type: 'Traveler',
                image: preview,
                caption: caption || 'A beautiful moment from Meghalaya 🌿',
                location: location || 'Meghalaya',
                likes: 0,
                isNew: true,
            });
        }
        setDone(true);
        setTimeout(() => { setDone(false); onClose(); }, 2200);
    };

    return (
        <motion.div
            className="c-modal-bg"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="c-modal"
                initial={{ opacity: 0, y: 48, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 32, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
            >
                <button className="c-modal__close" onClick={onClose}>✕</button>
                {done ? (
                    <motion.div className="c-modal__success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <div style={{ fontSize: 56 }}>🌿</div>
                        <h3>Story Posted!</h3>
                        <p>Your memory is now part of the Meghalaya community.</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="c-modal__form">
                        <div className="c-modal__header">
                            <div className="c-modal__icon"><CameraIcon /></div>
                            <h2>Share Your Journey</h2>
                            <p>Post your Meghalaya story to the community</p>
                        </div>
                        <label className="c-dropzone" onClick={() => document.getElementById('c-file-input').click()}>
                            {preview
                                ? <img src={preview} alt="preview" className="c-dropzone__preview" />
                                : <div className="c-dropzone__empty">
                                    <span style={{ fontSize: 36 }}>🖼️</span>
                                    <span>Click to upload photo or video</span>
                                    <span>Browse files</span>
                                </div>
                            }
                        </label>
                        <input id="c-file-input" type="file" accept="image/*,video/*" onChange={handleFile} style={{ display: 'none' }} />
                        <input className="c-input" placeholder="Your name (e.g. Risha)" value={username} onChange={e => setUsername(e.target.value)} />
                        <textarea className="c-input" rows={3} placeholder="Write your caption..." value={caption} onChange={e => setCaption(e.target.value)} />
                        <input className="c-input" placeholder="📍 Tag a location (e.g. Dawki)" value={location} onChange={e => setLocation(e.target.value)} />
                        <div className="c-modal__tags">
                            {['Shillong', 'Dawki', 'Mawlynnong', 'Laitlum', 'Cherrapunji'].map(t => (
                                <button key={t} type="button" className="c-tag-btn" onClick={() => setLocation(t)}>{t}</button>
                            ))}
                        </div>
                        <button type="submit" className="c-submit-btn">
                            <CameraIcon /> Post
                        </button>
                    </form>
                )}
            </motion.div>
        </motion.div>
    );
};

const CommunitySection = () => {
    const [posts, setPosts] = useState(POSTS);
    const [showModal, setShowModal] = useState(false);

    const handleNewPost = (newPost) => {
        setPosts(prev => [newPost, ...prev]);
    };
    const headerRef = useRef(null);
    const headerInView = useInView(headerRef, { once: true, margin: '-80px' });
    const ctaRef = useRef(null);
    const ctaInView = useInView(ctaRef, { once: true, margin: '-60px' });

    const headerVariants = {
        hidden: { opacity: 0, y: 32 },
        visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] } })
    };

    return (
        <section id="react-community" className="c-section">
            <style>{CSS}</style>
            <div className="c-container">

                {/* Header */}
                <div ref={headerRef} className="c-header">
                    <motion.span className="c-label" custom={0} variants={headerVariants} initial="hidden" animate={headerInView ? 'visible' : 'hidden'}>● COMMUNITY ROOTS</motion.span>
                    <motion.h2 className="c-title" custom={1} variants={headerVariants} initial="hidden" animate={headerInView ? 'visible' : 'hidden'}>
                        Stories Shared By <span>The People</span>
                    </motion.h2>
                    <motion.p className="c-subtitle" custom={2} variants={headerVariants} initial="hidden" animate={headerInView ? 'visible' : 'hidden'}>
                        Discover real moments from locals and travelers across Meghalaya.
                    </motion.p>
                    <motion.button className="c-join-btn" custom={3} variants={headerVariants} initial="hidden" animate={headerInView ? 'visible' : 'hidden'}>
                        Join The Community →
                    </motion.button>
                </div>

                {/* Cards grid */}
                <div className="c-grid">
                    {posts.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}
                </div>

                {/* CTA Row */}
                <motion.div
                    ref={ctaRef}
                    className="c-cta-row"
                    initial={{ opacity: 0, y: 40 }}
                    animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="c-cta-text">
                        <h3>Have a story to tell?</h3>
                        <p>Share your hidden gems, food, festivals and travel memories with the world.</p>
                    </div>
                    <motion.button
                        className="c-share-btn"
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        onClick={() => setShowModal(true)}
                    >
                        <CameraIcon /> Share Your Journey
                    </motion.button>
                </motion.div>
            </div>

            {showModal && <UploadModal onClose={() => setShowModal(false)} onPost={handleNewPost} />}
        </section>
    );
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
.c-section { background:#F6F1E8; padding:120px 0 80px; position:relative; z-index:100; min-height:100vh; }
.c-container { max-width:1280px; margin:0 auto; padding:0 32px; }
.c-header { text-align:center; margin-bottom:64px; }
.c-label { font-family:'Inter',sans-serif; font-size:11px; font-weight:700; color:#3F5E45; letter-spacing:3px; text-transform:uppercase; display:block; margin-bottom:16px; }
.c-title { font-family:'Inter',sans-serif; font-size:clamp(2.2rem,4.5vw,3.6rem); font-weight:800; color:#1D1D1B; line-height:1.1; letter-spacing:-0.04em; margin:0 0 18px; }
.c-title span { color:#3F5E45; }
.c-subtitle { font-family:'Inter',sans-serif; font-size:1rem; color:#6A665F; max-width:460px; margin:0 auto 28px; line-height:1.65; }
.c-join-btn { background:#3F5E45; color:#fff; border:none; border-radius:40px; padding:13px 28px; font-family:'Inter',sans-serif; font-weight:600; font-size:14px; cursor:pointer; transition:background .25s,box-shadow .25s; box-shadow:0 6px 20px rgba(63,94,69,.28); }
.c-join-btn:hover { background:#2E4735; box-shadow:0 12px 30px rgba(63,94,69,.38); }
.c-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }
.c-card { border-radius:20px; overflow:hidden; background:#fff; box-shadow:0 6px 28px rgba(0,0,0,.09); cursor:pointer; will-change:transform; position:relative; }
.c-card--new { box-shadow:0 0 0 2.5px #3F5E45, 0 8px 32px rgba(63,94,69,.22); }
.c-card__new-badge { position:absolute; top:12px; left:12px; z-index:10; background:#3F5E45; color:#fff; font-family:'Inter',sans-serif; font-size:10px; font-weight:700; letter-spacing:1px; padding:5px 11px; border-radius:20px; text-transform:uppercase; box-shadow:0 4px 12px rgba(63,94,69,.4); }
.c-card__img-wrap { position:relative; overflow:hidden; height:400px; }
.c-card__img { width:100%; height:100%; object-fit:cover; transition:transform .75s cubic-bezier(.16,1,.3,1); display:block; }
.c-card:hover .c-card__img { transform:scale(1.08); }
.c-card__overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(8,12,10,.9) 0%,rgba(8,12,10,.45) 45%,transparent 100%); opacity:0; transition:opacity .4s ease; display:flex; flex-direction:column; justify-content:flex-end; padding:24px; }
.c-card:hover .c-card__overlay { opacity:1; }
.c-card__overlay-inner { transform:translateY(14px); transition:transform .45s cubic-bezier(.16,1,.3,1); }
.c-card:hover .c-card__overlay-inner { transform:translateY(0); }
.c-card__location { color:rgba(255,255,255,.6); font-family:'Inter',sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:8px; }
.c-card__caption { color:#fff; font-family:'Inter',sans-serif; font-size:14px; line-height:1.55; margin:0 0 14px; }
.c-card__actions { display:flex; gap:7px; flex-wrap:wrap; }
.c-like,.c-action-btn { background:rgba(255,255,255,.11); border:1px solid rgba(255,255,255,.2); color:#fff; border-radius:20px; padding:7px 12px; font-family:'Inter',sans-serif; font-size:11px; font-weight:500; cursor:pointer; transition:background .2s,transform .2s; backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); }
.c-like:hover,.c-action-btn:hover { background:rgba(255,255,255,.25); transform:scale(1.06); }
.c-like--active { background:rgba(227,93,93,.85) !important; border-color:rgba(227,93,93,.7) !important; }
.c-card__meta { display:flex; align-items:center; gap:11px; padding:16px 20px; border-top:1px solid rgba(0,0,0,.05); }
.c-card__avatar { width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg,#3F5E45,#C98A3D); color:#fff; display:flex; align-items:center; justify-content:center; font-family:'Inter',sans-serif; font-weight:800; font-size:12px; flex-shrink:0; box-shadow:0 3px 10px rgba(63,94,69,.28); }
.c-card__username { font-family:'Inter',sans-serif; font-weight:700; font-size:13px; color:#1D1D1B; }
.c-badge { font-family:'Inter',sans-serif; font-size:9px; font-weight:700; padding:3px 8px; border-radius:20px; text-transform:uppercase; letter-spacing:.5px; display:inline-block; margin-top:3px; }
.c-badge--local { background:#EAF1EA; color:#3F5E45; }
.c-badge--traveler { background:#FDF2E3; color:#C98A3D; }
.c-cta-row { margin-top:72px; background:linear-gradient(130deg,#2E4735 0%,#3F5E45 55%,#4a7055 100%); border-radius:24px; padding:52px 64px; display:flex; align-items:center; justify-content:space-between; gap:36px; box-shadow:0 24px 72px rgba(46,71,53,.38); position:relative; overflow:hidden; }
.c-cta-row::after { content:''; position:absolute; top:-80px; right:-80px; width:300px; height:300px; background:radial-gradient(circle,rgba(201,138,61,.22),transparent 70%); pointer-events:none; }
.c-cta-text h3 { font-family:'Inter',sans-serif; font-size:clamp(1.5rem,2.8vw,2.2rem); font-weight:800; color:#fff; margin:0 0 10px; letter-spacing:-0.04em; }
.c-cta-text p { font-family:'Inter',sans-serif; font-size:.95rem; color:rgba(255,255,255,.7); margin:0; line-height:1.6; }
.c-share-btn { background:#C98A3D; color:#fff; border:none; border-radius:40px; padding:17px 36px; font-family:'Inter',sans-serif; font-weight:700; font-size:15px; cursor:pointer; white-space:nowrap; box-shadow:0 8px 24px rgba(201,138,61,.45); position:relative; z-index:1; display:flex; align-items:center; gap:10px; }
.c-modal-bg { position:fixed; inset:0; background:rgba(10,15,12,.78); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px; }
.c-modal { background:#F6F1E8; border-radius:28px; width:100%; max-width:560px; max-height:94vh; overflow-y:auto; position:relative; box-shadow:0 56px 160px rgba(0,0,0,.52); }
.c-modal__close { position:absolute; top:16px; right:16px; background:rgba(0,0,0,.08); border:none; border-radius:50%; width:38px; height:38px; font-size:14px; cursor:pointer; z-index:10; transition:background .2s,transform .2s; display:flex; align-items:center; justify-content:center; }
.c-modal__close:hover { background:rgba(0,0,0,.18); transform:scale(1.1); }
.c-modal__success { text-align:center; padding:80px 40px; }
.c-modal__success h3 { font-family:'Inter',sans-serif; font-size:2rem; font-weight:800; color:#3F5E45; margin:16px 0 8px; letter-spacing:-0.04em; }
.c-modal__success p { font-family:'Inter',sans-serif; color:#6A665F; font-size:.95rem; line-height:1.6; }
.c-modal__form { padding:44px; display:flex; flex-direction:column; gap:16px; }
.c-modal__header { margin-bottom:6px; }
.c-modal__icon { width:48px; height:48px; border-radius:14px; background:linear-gradient(135deg,#3F5E45,#2E4735); color:#fff; display:flex; align-items:center; justify-content:center; margin-bottom:14px; box-shadow:0 6px 18px rgba(63,94,69,.3); }
.c-modal__header h2 { font-family:'Inter',sans-serif; font-size:1.9rem; font-weight:800; color:#1D1D1B; margin:0 0 6px; letter-spacing:-0.04em; }
.c-modal__header p { font-family:'Inter',sans-serif; font-size:.95rem; color:#6A665F; margin:0; }
.c-dropzone { border:2px dashed rgba(63,94,69,.3); border-radius:16px; min-height:180px; display:flex; align-items:center; justify-content:center; cursor:pointer; overflow:hidden; transition:border-color .3s,background .3s,box-shadow .3s; background:#EFE7D8; }
.c-dropzone:hover { border-color:#3F5E45; background:#E5DAC9; box-shadow:0 0 0 4px rgba(63,94,69,.09); }
.c-dropzone__preview { width:100%; height:230px; object-fit:cover; display:block; }
.c-dropzone__empty { display:flex; flex-direction:column; align-items:center; gap:10px; color:#6A665F; font-family:'Inter',sans-serif; font-size:13px; padding:20px; text-align:center; }
.c-dropzone__empty span:last-child { color:#3F5E45; font-weight:600; }
.c-input { border:1.5px solid rgba(0,0,0,.1); border-radius:12px; padding:13px 16px; font-family:'Inter',sans-serif; font-size:13px; color:#1D1D1B; background:#fff; width:100%; box-sizing:border-box; resize:none; transition:border-color .2s,box-shadow .2s; }
.c-input:focus { outline:none; border-color:#3F5E45; box-shadow:0 0 0 3px rgba(63,94,69,.1); }
.c-modal__tags { display:flex; gap:7px; flex-wrap:wrap; }
.c-tag-btn { background:#EAF1EA; color:#3F5E45; border:1px solid rgba(63,94,69,.2); border-radius:20px; padding:6px 14px; font-family:'Inter',sans-serif; font-size:11px; font-weight:600; cursor:pointer; transition:background .2s,transform .2s; }
.c-tag-btn:hover { background:#3F5E45; color:#fff; transform:scale(1.05); }
.c-submit-btn { background:linear-gradient(135deg,#3F5E45,#2E4735); color:#fff; border:none; border-radius:14px; padding:16px; font-family:'Inter',sans-serif; font-weight:700; font-size:15px; cursor:pointer; transition:transform .2s,box-shadow .2s; margin-top:4px; box-shadow:0 6px 20px rgba(63,94,69,.28); display:flex; align-items:center; justify-content:center; gap:10px; }
.c-submit-btn:hover { transform:translateY(-2px); box-shadow:0 14px 36px rgba(63,94,69,.38); }
@media(max-width:900px){ .c-grid{grid-template-columns:1fr 1fr;} .c-cta-row{flex-direction:column;text-align:center;padding:40px 28px;} .c-share-btn{justify-content:center;} }
@media(max-width:580px){ .c-grid{grid-template-columns:1fr;} .c-modal__form{padding:26px;} .c-card__img-wrap{height:320px;} }
`;

export default CommunitySection;
