import React, { useState, useEffect } from 'react';
import WorkItem from './WorkItem';

function Landing() {
  const [workItems, setWorkItems] = useState([]);

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

  return (
    <div>
      <button type="button" onClick={addWorkItem}>Add Work Item</button>
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
