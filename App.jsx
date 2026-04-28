import React from 'react';
import CompactStorySection from './components/CompactStorySection';
import MapSection from './components/MapSection';
import CommunitySection from './components/CommunitySection';

const App = () => {
    return (
        <div className="app-container">
            <CompactStorySection />
            <MapSection />
            <CommunitySection />
        </div>
    );
};

export default App;
