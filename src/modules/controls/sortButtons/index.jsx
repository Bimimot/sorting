import { useDispatch, useSelector } from "react-redux";

import { Button } from "shared";

import styles from "./styles";

const bubbleSort = () => ({ type: "SORTING/BUBBLE_SORT" });

const SortButtons = () => {
  const dispatch = useDispatch();

  const onBubbleSort = () => dispatch(bubbleSort());

  return (
    <div className={styles.buttons}>
      <Button text="Пузырьком" onClick={onBubbleSort} />
    </div>
  );
};

export default SortButtons;
