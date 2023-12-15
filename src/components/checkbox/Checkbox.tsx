import React, { ChangeEvent } from 'react'
import styles from './Checkbox.module.scss'

interface ICheckboxProps {
    disabled?: boolean;
    checked?: boolean;
    label: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    [x: string]: any;
}

const Checkbox = ({
    disabled = false,
    checked = false,
    label,
    onChange,
    ...restProps
}: ICheckboxProps) => {
  return (
    <div className={styles.checkboxContainer}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className={styles.checkbox} // 체크박스 스타일 적용
        {...restProps}
      />
      <span className={styles.checkboxLabel}>{label}</span>
    </div>
  );
}

export default Checkbox