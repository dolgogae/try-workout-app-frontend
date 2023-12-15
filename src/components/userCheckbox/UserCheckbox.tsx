import React, { ChangeEvent, useEffect } from 'react'
import styles from './UserCheckbox.module.scss';
import Checkbox from '../checkbox/Checkbox';

interface IUserCheckboxProps {
    // label?: string;
    disabled?: boolean;
    checkedUser: boolean;
    onChangeUser: (e: ChangeEvent<HTMLInputElement>) => void;
    checkedTrainer: boolean;
    onChangeTrainer: (e: ChangeEvent<HTMLInputElement>) => void;
}

const UserCheckbox = ({
  // label = '유저 타입',
  checkedUser,
  disabled,
  onChangeUser,
  checkedTrainer,
  onChangeTrainer,
  ...restProps
}: IUserCheckboxProps) => {
  return (
    <div className={styles.wrapper}>
      <Checkbox
        label="일반 사용자 "
        checked={checkedUser}
        disabled={disabled}
        onChange={onChangeUser}
        {...restProps}
      />
      <Checkbox
        label="트레이너 "
        checked={checkedTrainer}
        disabled={disabled}
        onChange={onChangeTrainer}
        {...restProps}
      />
    </div>
  )
}

export default UserCheckbox
