import React, { createContext, useContext, useState, useCallback } from 'react';

const RoadmapContext = createContext(null);

export function RoadmapProvider({ children }) {
  const [roadmapMode, setRoadmapMode] = useState(false);

  const toggleRoadmapMode = useCallback(() => {
    setRoadmapMode((prev) => !prev);
  }, []);

  return (
    <RoadmapContext.Provider value={{ roadmapMode, toggleRoadmapMode }}>
      {children}
    </RoadmapContext.Provider>
  );
}

export function useRoadmap() {
  const ctx = useContext(RoadmapContext);
  if (!ctx) throw new Error('useRoadmap must be used within RoadmapProvider');
  return ctx;
}
