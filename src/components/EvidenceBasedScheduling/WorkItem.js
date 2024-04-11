import React, { useState } from 'react';
import { TextInput, Button, Text } from '@mantine/core';
import PropTypes from 'prop-types';

function WorkItem({
  id, title, elapsed, estimatedTime, running, onStartStop, onTitleChange, onEstimatedTimeChange,
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingEstimatedTime, setEditingEstimatedTime] = useState(false);

  const formatTime = (time) => {
    const seconds = Math.floor(time / 1000) % 60;
    const minutes = Math.floor(time / 60000) % 60;
    const hours = Math.floor(time / 3600000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      {id}
      {' '}
      {editingTitle ? (
        <TextInput
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          onBlur={() => setEditingTitle(false)}
          autoFocus
        />
      ) : (
        <Text onClick={() => setEditingTitle(true)} style={{ cursor: 'pointer', marginBottom: '10px' }}>{title}</Text>
      )}
      <Text>
        Elapsed Time:
        {formatTime(elapsed)}
      </Text>
      {editingEstimatedTime ? (
        <TextInput
          type="number"
          value={estimatedTime.toString()}
          onChange={(event) => onEstimatedTimeChange(Number(event.target.value))}
          onBlur={() => setEditingEstimatedTime(false)}
          autoFocus
        />
      ) : (
        <Text onClick={() => setEditingEstimatedTime(true)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
          Estimated Time:
          {' '}
          {estimatedTime}
          {' '}
          minutes
        </Text>
      )}
      <Button onClick={onStartStop}>
        {running ? 'Stop' : 'Start'}
      </Button>
    </div>
  );
}

WorkItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  elapsed: PropTypes.number.isRequired,
  estimatedTime: PropTypes.number.isRequired,
  running: PropTypes.bool.isRequired,
  onStartStop: PropTypes.func.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  onEstimatedTimeChange: PropTypes.func.isRequired,
};

export default WorkItem;
