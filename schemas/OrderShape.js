import { PropTypes } from 'react';

export default {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  disciplineId: PropTypes.number.isRequired,
  academicLevelId: PropTypes.number.isRequired,
  pagesCount: PropTypes.number.isRequired,
  deadline: PropTypes.instanceOf(Date).isRequired,
  cost: PropTypes.number.isRequired,
  isVisited: PropTypes.bool.isRequired,
  isSuggested: PropTypes.bool.isRequired,
  typeId: PropTypes.oneOf(['order', 'inquiry', 'revision']).isRequired,
};
