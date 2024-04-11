import React, { useState } from 'react';
import {
  Group, TextInput, Text, Button, Paper, Tooltip,
} from '@mantine/core';

import {
  IconClock, IconPlayerPlay,
  IconPlayerStop, IconTrash, IconEdit, IconFileText, IconHourglass, IconSpeedboat,
} from '@tabler/icons';

import PropTypes from 'prop-types';

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

function WorkItem({
  id, title, elapsed, estimatedTime, running, onStartStop, onTitleChange,
  onEstimatedTimeChange, onDelete,
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingEstimatedTime, setEditingEstimatedTime] = useState(false);

  const formatTime = (time) => (time / 60000).toFixed(2);

  const velocity = estimatedTime > 0 ? ((elapsed / 60000) / estimatedTime).toFixed(2) : 'N/A';

  return (
    <Paper withBorder shadow="sm" p="md" radius="md" style={{ flex: 1 }}>
      <Group position="apart" style={{ alignItems: 'center', flex: 1 }}>
        {/* <Text>{id + 1}</Text> */}
        <Group spacing="xs" style={{ flex: 1 }}>
          {editingTitle ? (
            <TextInput
              icon={<IconEdit size={14} />}
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              onBlur={() => setEditingTitle(false)}
              autoFocus
              size="xs"
            />
          ) : (
            <Tooltip label="Edit title" position="bottom" withArrow>
              <div
                style={{
                  display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1,
                }}
                onClick={() => setEditingTitle(true)}
              >
                <IconFileText size={16} />
                <Text style={{ marginLeft: 5 }}>{title}</Text>
              </div>
            </Tooltip>
          )}

          {editingEstimatedTime ? (
            <TextInput
              icon={<IconEdit size={14} />}
              type="number"
              value={estimatedTime.toString()}
              onChange={(event) => onEstimatedTimeChange(Number(event.target.value))}
              onBlur={() => setEditingEstimatedTime(false)}
              autoFocus
              size="xs"
            />
          ) : (
            <Tooltip label="Edit estimated time" position="bottom" withArrow>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setEditingEstimatedTime(true)}>
                <IconHourglass size={16} />
                <Text size="sm" style={{ marginLeft: 5 }}>
                  {estimatedTime}
                </Text>
              </div>
            </Tooltip>
          )}
          <Tooltip label="Elapsed Time" position="bottom" withArrow>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconClock size={16} />
              <Text size="sm" style={{ marginLeft: 5 }}>{formatTime(elapsed)}</Text>
            </div>
          </Tooltip>
          <Tooltip label="Velocity" position="bottom" withArrow>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconSpeedboat size={16} />
              <Text size="sm" style={{ marginLeft: 5 }}>
                {velocity}
              </Text>
            </div>
          </Tooltip>
        </Group>
        <Group noWrap>
          <Tooltip label={running ? 'Stop' : 'Start'} position="bottom" withArrow>
            <Button onClick={onStartStop} size="xs">
              {running ? <IconPlayerStop size={14} /> : <IconPlayerPlay size={14} />}
            </Button>
          </Tooltip>
          <Tooltip label="Delete" position="bottom" withArrow>
            <Button color="red" onClick={() => onDelete(id)} size="xs"><IconTrash size={14} /></Button>
          </Tooltip>
        </Group>
      </Group>
    </Paper>
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
  onDelete: PropTypes.func.isRequired,
};

export default WorkItem;
