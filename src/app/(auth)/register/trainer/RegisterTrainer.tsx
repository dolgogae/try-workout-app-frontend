"use client";
import Loader from '@/components/loader/Loader';
import React, { useEffect, useState } from 'react'
import styles from '../../login/Auth.module.scss';
import Textarea from '@/components/textarea/Textarea';
import Button from '@/components/button/Button';
import Checkbox from '@/components/checkbox/Checkbox';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation';

interface ITrainerProps {
  userId: number;
  introduction: string;
  trainerType: string;
}

const RegisterTrainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [introduction, setIntroduction] = useState("");
  const [trainerType, setTrainerType] = useState("");
  const [isHealth, setIsHealth] = useState(false);
  const [isPilates, setIsPilates] = useState(false);
  
  const params = useSearchParams();
  const userId = Number(params.get('userId'));
  const router = useRouter();

  if(!userId){
    console.error("로그인을 완료해주세요.")
    router.push('/login');
  }

  useEffect(() => {
    if(isHealth){
      setTrainerType("HEALTH");
      setIsPilates(false);
    }
  }, [isHealth]);

  useEffect(() => {
    if(isPilates){
      setTrainerType("PILATES");
      setIsHealth(false);
    }
  }, [isPilates]);

  const fetchCreateTrainer = async ({
    userId,
    introduction,
    trainerType
  }: ITrainerProps) => {
    try {
      const response = await axios.post('http://localhost:8080/api/trainer', {
        userId,
        introduction,
        trainerType
      })

      return response.data;
    } catch (error){
      console.error('api 조회 실패: ', error);
      throw error;
    }
  }

  const registerTrainer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!isHealth && !isPilates){
      return toast.error(`트레이너 정보를 입력해주세요.`);
    }
    if(!introduction){
      return toast.error(`소개를 입력해주세요.`);
    }

    // trainer create api 호출
    const result = fetchCreateTrainer({userId, introduction, trainerType});
    
    toast.success("트레이너 생성 성공...");
    router.push('/');
  }

  return (
    <>
      {isLoading && <Loader />}
      <section className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.introLogo}>
            Trainer Card
          </h1>
          <form onSubmit={registerTrainer} className={styles.form}>  
            <h3 className={styles.inputLabel}>
              운동 종류
            </h3>
            <div className={classNames(styles.gruop, styles.checkbox)}>  
              <Checkbox
                label="헬스"
                checked={isHealth}
                onChange={(e) => setIsHealth(e.target.checked)}
              />
              <Checkbox
                label="필라테스"
                checked={isPilates}
                onChange={(e) => setIsPilates(e.target.checked)}
              />
            </div>
            <h3 className={styles.inputLabel}>
              소개
            </h3>
            <Textarea
              id='introduction'
              rows={15}
              name='introduction'
              placeholder='소개를 입력해주세요.'
              onChange={(e) => setIntroduction(e.target.value)}
            />
            <div className={styles.buttonGroup}>
              <Button type="submit" width="100%">
                입력
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default RegisterTrainer
