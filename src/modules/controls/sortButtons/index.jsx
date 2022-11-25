import { useDispatch } from "react-redux";
import { Button } from "shared";
import styles from "./styles";


const SortButtons = () => {
  const dispatch = useDispatch();

  return (
    <div className={styles.buttons}>
      <Button
        text="BUBBLE SORTING"
        onClick={() => dispatch({ type: "SORTING/BUBBLE_SORT" })}
      />
      <Button
        text="MERGE SORTING"
        onClick={() => dispatch({ type: "SORTING/MERGE_SORT" })}
      />

      <Button
        text="SHAKE SORTING"
        onClick={() => dispatch({ type: "SORTING/SHAKER_SORT" })}
      />
    </div>
  );
};

export default SortButtons;
