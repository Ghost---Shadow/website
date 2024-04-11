import React from 'react';
import {
  Group, Text, Button, Paper, Tooltip,
  Box,
} from '@mantine/core';

import {
  IconClock, IconPlayerPlay,
  IconPlayerStop, IconTrash, IconHourglass, IconSpeedboat,
  IconFileText,
} from '@tabler/icons';
import PropTypes from 'prop-types';
import EditableText from './EditableText';

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

function WorkItem({
  id, title, elapsed, estimatedTime, running, onStartStop, onTitleChange,
  onEstimatedTimeChange, onDelete,
}) {
  const formatTime = (time) => (time / 60000).toFixed(2);

  const velocity = estimatedTime > 0 ? ((elapsed / 60000) / estimatedTime).toFixed(2) : 'N/A';

  return (
    <Paper withBorder shadow="sm" p="md" radius="md" style={{ flex: 1 }}>
      <Group position="apart" style={{ alignItems: 'center', flex: 1 }}>
        {/* <Text>{id + 1}</Text> */}
        <Group spacing="xs" style={{ flex: 1 }}>
          <EditableText
            text={title}
            tooltipLabel="Edit task title"
            type="text"
            onTextChange={onTitleChange}
            IconComponent={IconFileText}
          />
          <Box style={{ minWidth: '3rem' }}>
            <EditableText
              text={estimatedTime.toString()}
              tooltipLabel="Edit estimated time"
              type="number"
              onTextChange={onEstimatedTimeChange}
              IconComponent={IconHourglass}
            />
          </Box>
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
