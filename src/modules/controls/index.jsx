import ResetButton from "./resetButton";

import styles from './styles';

const Controls = () => {
  return (
    <div className={ styles.controls }>
      <div className={ styles.controls__buttons }>
        <ResetButton />
      </div>
    </div>
  );
};

export default Controls;