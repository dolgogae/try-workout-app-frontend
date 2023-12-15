import classNames from 'classnames'
import React, { ChangeEvent, useState } from 'react'
import styles from './Textarea.module.scss';

interface ITextAreaProps {
  id: string;
  rows: number;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  value?: string;
  className?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  [x: string]: any;
}


const Textarea = ({
  id,
  rows = 5,
  name = '',
  placeholder = '',
  readOnly,
  disabled,
  value,
  className = '',
  onChange,
  ...restProps
}: ITextAreaProps) => {

  const [inputValue, setInputValue] = useState(value ? value : '');
  

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    onChange(e);
  }

  return (
    <div className={classNames(styles.formControl, className)}>
      <div
        className={classNames(styles.inputWrapper)}
      >
        <textarea
          id={id}
          name={name}
          className={classNames(styles.input)}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          value={inputValue}
          onChange={handleChange}
          rows={rows}
          {...restProps}
        />
      </div>
    </div>
  )
}

export default Textarea