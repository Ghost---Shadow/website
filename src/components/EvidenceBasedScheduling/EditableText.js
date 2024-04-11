import React, { useState } from 'react';
import {
  TextInput, Text, Tooltip, Box,
} from '@mantine/core';
import { IconEdit } from '@tabler/icons';
import PropTypes from 'prop-types';

function EditableText({
  tooltipLabel,
  text,
  type,
  onTextChange,
  IconComponent,
}) {
  const [editing, setEditing] = useState(false);

  const iconSize = 16;

  if (editing) {
    return (
      <TextInput
        style={{ flex: 1 }}
        type={type}
        icon={<IconEdit size={iconSize} />}
        value={text}
        onChange={(event) => onTextChange(type === 'number' ? Number(event.target.value) : event.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            setEditing(false);
          }
        }}
        onFocus={(event) => event.target.select()}
        autoFocus
        size="xs"
      />
    );
  }

  return (
    <Tooltip label={tooltipLabel} position="bottom" withArrow>
      <Box
        style={{
          display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1,
        }}
        onClick={() => setEditing(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            setEditing(false);
          }
        }}
      >
        <IconComponent size={iconSize} />
        <Text style={{ marginLeft: 5 }}>{text}</Text>
      </Box>
    </Tooltip>
  );
}

EditableText.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  tooltipLabel: PropTypes.string.isRequired,
  onTextChange: PropTypes.func.isRequired,
  IconComponent: PropTypes.node.isRequired,
};

export default EditableText;
