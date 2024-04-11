import React, { useState, useEffect } from 'react';
import WorkItem from './WorkItem';

function Landing() {
  const [workItems, setWorkItems] = useState(() => {
    // Attempt to get saved work items from localStorage
    const savedWorkItems = localStorage.getItem('workItems');
    return savedWorkItems ? JSON.parse(savedWorkItems) : [];
  });

  useEffect(() => {
    // Prepare workItems for saving: stop running items and update their elapsed time
    const now = new Date().getTime();
    const preparedWorkItems = workItems.map((item) => {
      if (item.running) {
        return {
          ...item,
          running: false,
          elapsed: item.elapsed + (now - item.lastStart),
          lastStart: now,
        };
      }
      return item;
    });

    // Save preparedWorkItems to localStorage
    localStorage.setItem('workItems', JSON.stringify(preparedWorkItems));
  }, [workItems]);

  const handleStartStop = (id) => {
    const now = new Date().getTime();
    setWorkItems((current) => current.map((item) => {
      if (item.id === id) {
        return item.running
          ? {
            ...item,
            running: false,
            elapsed: item.elapsed + (now - item.lastStart),
            lastStart: now,
          }
          : { ...item, running: true, lastStart: now };
      }
      return item;
    }));
  };

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
    }, 1000);

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

  const calculateAverageVelocity = () => {
    // Consider only items that are not currently running
    const validItems = workItems
      .filter((item) => item.estimatedTime > 0 && item.elapsed > 0 && !item.running);
    if (validItems.length === 0) return 0;

    const totalVelocity = validItems
      .reduce((acc, item) => acc + (item.elapsed / 60000) / item.estimatedTime, 0);

    return totalVelocity / validItems.length;
  };

  const clearAllWorkItems = () => {
    setWorkItems([]); // Clear work items from state
    localStorage.removeItem('workItems'); // Clear work items from localStorage
  };

  const totalEstimatedTime = workItems.reduce((acc, item) => acc + item.estimatedTime, 0);
  const totalElapsedTime = workItems.reduce((acc, item) => acc + item.elapsed, 0) / 60000;
  const averageVelocity = calculateAverageVelocity();
  const correctedEstimatedTime = totalEstimatedTime * averageVelocity;
  const timeToCompletion = correctedEstimatedTime - totalElapsedTime;

  return (
    <div>
      <button type="button" onClick={addWorkItem}>Add Work Item</button>
      <button type="button" color="red" onClick={clearAllWorkItems}>Clear All</button>
      <div>
        Average Velocity:
        {calculateAverageVelocity().toFixed(2)}
      </div>
      <div>
        Total Estimated Time:
        {totalEstimatedTime.toFixed(2)}
        {' '}
        minutes
      </div>
      <div>
        Total Elapsed Time:
        {totalElapsedTime.toFixed(2)}
        {' '}
        minutes
      </div>
      <div>
        Corrected Estimated Time:
        {correctedEstimatedTime.toFixed(2)}
        {' '}
        minutes
      </div>
      <div>
        Time to Completion:
        {timeToCompletion.toFixed(2)}
        {' '}
        minutes
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
