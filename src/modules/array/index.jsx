import { createArray } from '../../helpers';

import Bar from '../bar';

import styles from './styles';

const WIDTH_MULTIPLIER = window.screen.width;
const ARRAY = createArray(30);
const BAR_WIDTH = WIDTH_MULTIPLIER / ARRAY.length;

const Array = () => (
  <div className={ styles.array }>
    {
      ARRAY.map((height, index) => (
          <Bar
            key={ index }
            width={ BAR_WIDTH }
            height={ height }
          />
        )
      )
    }
  </div>
);

export default Array;