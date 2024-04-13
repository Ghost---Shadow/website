import {
  Paper, Table,
} from '@mantine/core';
import PropTypes from 'prop-types';

function StatisticsTable({
  calculateAverageVelocity,
  totalEstimatedTime,
  totalElapsedTime,
  correctedEstimatedTime,
  timeToCompletion,
}) {
  return (
    <Paper style={{ flex: 1 }} withBorder shadow="sm" p="md" radius="md">
      <Table>
        <thead>
          <tr>
            <th>Statistic</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Average Velocity</td>
            <td>{(calculateAverageVelocity()).toFixed(2)}</td>
          </tr>
          <tr>
            <td>Total Estimated Time</td>
            <td>
              {(totalEstimatedTime / 60).toFixed(2)}
              {' '}
              hours
            </td>
          </tr>
          <tr>
            <td>Total Elapsed Time</td>
            <td>
              {(totalElapsedTime / 60).toFixed(2)}
              {' '}
              hours
            </td>
          </tr>
          <tr>
            <td>Corrected Estimated Time</td>
            <td>
              {(correctedEstimatedTime / 60).toFixed(2)}
              {' '}
              hours
            </td>
          </tr>
          <tr>
            <td>Time to Completion</td>
            <td>
              {(timeToCompletion / 60).toFixed(2)}
              {' '}
              hours
            </td>
          </tr>
        </tbody>
      </Table>
    </Paper>
  );
}

StatisticsTable.propTypes = {
  calculateAverageVelocity: PropTypes.func.isRequired,
  totalEstimatedTime: PropTypes.number.isRequired,
  totalElapsedTime: PropTypes.number.isRequired,
  correctedEstimatedTime: PropTypes.number.isRequired,
  timeToCompletion: PropTypes.number.isRequired,
};

export default StatisticsTable;
