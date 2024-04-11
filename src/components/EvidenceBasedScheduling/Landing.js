import React, { useState, useEffect } from 'react';
import WorkItem from './WorkItem';

function Landing() {
  const [workItems, setWorkItems] = useState([]);

  // Function to handle start/stop
  const handleStartStop = (id) => {
    const now = new Date().getTime();
    setWorkItems((current) => current.map((item) => {
      if (item.id === id) {
        return item.running
          ? {
            ...item,
            running: false,
            elapsed: item.elapsed + (now - item.lastStart),
            lastStart: null,
          }
          : { ...item, running: true, lastStart: now };
      }
      return item;
    }));
  };

  // Effect hook to update elapsed time every second for running tasks
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkItems((current) => current.map((item) => {
        if (item.running) {
          const now = new Date().getTime();
          const additionalTime = now - item.lastStart;
          return { ...item, elapsed: item.elapsed + additionalTime, lastStart: now };
        }
        return item;
      }));
    }, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleTitleChange = (id, newTitle) => {
    setWorkItems((current) => current
      .map((item) => (item.id === id ? { ...item, title: newTitle } : item)));
  };

  const handleEstimatedTimeChange = (id, newEstimatedTime) => {
    setWorkItems((current) => current
      .map((item) => (item.id === id ? { ...item, estimatedTime: newEstimatedTime } : item)));
  };

  const addWorkItem = () => {
    setWorkItems((current) => [
      ...current,
      {
        id: current.length, title: `Task ${current.length + 1}`, elapsed: 0, estimatedTime: 0, running: false, lastStart: null,
      },
    ]);
  };

  useEffect(() => {
    addWorkItem();
  }, []);

  // Calculate average velocity
  const calculateAverageVelocity = () => {
    const validItems = workItems.filter((item) => item.estimatedTime > 0 && item.elapsed > 0);
    if (validItems.length === 0) return 0;

    const totalVelocity = validItems
      .reduce((acc, item) => acc + (item.elapsed / 60000) / item.estimatedTime, 0);

    return totalVelocity / validItems.length;
  };

  return (
    <div>
      <button type="button" onClick={addWorkItem}>Add Work Item</button>
      <div>
        Average Velocity:
        {calculateAverageVelocity().toFixed(2)}
      </div>
      {workItems.map((item) => (
        <WorkItem
          key={item.id}
          id={item.id}
          title={item.title}
          elapsed={item.elapsed}
          estimatedTime={item.estimatedTime}
          running={item.running}
          onStartStop={() => handleStartStop(item.id)}
          onTitleChange={(newTitle) => handleTitleChange(item.id, newTitle)}
          onEstimatedTimeChange={(newTime) => handleEstimatedTimeChange(item.id, newTime)}
        />
      ))}
    </div>
  );
}

export default Landing;
