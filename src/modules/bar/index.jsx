import styles from './styles';

const Bar = ({ width, height }) => {
  const barStyles = {
    height: `${ height }px`,
    width: `${ width }px`
  };

  return <div className={ styles.bar } style={ barStyles } />;
}

export default Bar;