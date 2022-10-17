import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Bar from '../bar';

import styles from './styles';

const WIDTH_MULTIPLIER = window.screen.width;

const resetArray = () => ({ type: 'CONTROLS/RESET_ARRAY' });

const Array = () => {
  const array = useSelector(({ arraySettings }) => arraySettings.array);

  const dispatch = useDispatch();
  const createArray = () => dispatch(resetArray());

  useEffect(() => {
    createArray()
  }, []);

  const barWidth = WIDTH_MULTIPLIER / array.length || 0;

  return (
    <div className={ styles.array }>
      {
        array.map((height, index) => (
            <Bar
              key={ index }
              width={ barWidth }
              height={ height }
            />
          )
        )
      }
    </div>
  );
}

export default Array;