import React, { useState } from 'react';
import {
  TextInput, Button, Text, Group,
} from '@mantine/core';
import PropTypes from 'prop-types';

function WorkItem({
  id, title, elapsed, estimatedTime, running, onStartStop, onTitleChange, onEstimatedTimeChange,
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingEstimatedTime, setEditingEstimatedTime] = useState(false);

  const formatTime = (time) => (time / 60000).toFixed(2);

  return (
    <Group style={{ marginBottom: '20px' }}>
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
    </Group>
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
