"use client";
import Loader from "@/components/loader/Loader";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "../login/Auth.module.scss";
import Button from "@/components/button/Button";
import Divider from "@/components/divider/Divider";
import Link from "next/link";

import { toast } from "react-toastify";
import Input from "@/components/input/Input";
import UserCheckbox from "@/components/userCheckbox/UserCheckbox";
import axios from "@/api/axios";

interface NormalUserInfo {
  username: string;
  // additional information
}

interface TrainerInfo{
  username: string;
  // additional information
}

interface SignUpProp {
  username: string;
  email: string;
  password: string;
  userRole: string;
  accountType: string;
}


export const fetchSignUp = async ({
  username,
  email, 
  password, 
  userRole, 
  accountType
}: SignUpProp) => {
  try {
    console.log('API URL:', process.env.REACT_APP_API_URL);
    const response = await axios.post('/api/auth/sign-up', {
      username,
      email,
      password,
      userRole,
      accountType
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// TODO: if user choose normal user or trainer, 
//       then show display write additional info
const RegisterClient = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isTrainer, setIsTrainer] = useState(false);
  const [userRole, setUserRole] = useState("NO_USER");

  const router = useRouter();

  useEffect(() => {
    if(isMember){
      setIsTrainer(false);
      setUserRole("MEMBER");
    }
  }, [isMember]);

  useEffect(() => {
    if(isTrainer){
      setIsMember(false);
      setUserRole("TRAINER");
    }
  }, [isTrainer]);

  const registerUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== cPassword) {
      return toast.error(`비밀번호가 일치하지 않습니다.`);
    }
    if (password.length < 8) {
      return toast.error(`비밀번호를 최소 8글자 이상 입력해주세요.`)
    }

    setIsLoading(true);

    // 소셜 로그인이 아닌 회원가입(NORMAL)
    const accountType = "NORMAL";
    fetchSignUp({ username, email, password, userRole, accountType })
        .then(result => {
          setIsLoading(false);
          toast.success("등록 성공...");

          if (isTrainer) {
            router.push(`/register/trainer?userId=` + result.id);
          } else if (isMember) {
            router.push("/register/member");
          }
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.message);
        });
  };

  return (
    <>
      {isLoading && <Loader />}
      <section className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.logo}>
            Sign Up
          </h1>

          <form onSubmit={registerUser} className={styles.form}>
            {/* Input */}
            <Input
              email
              icon="letter"
              id="email"
              name="email"
              label="이메일"
              placeholder="ID (email)"
              className={styles.control}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              password
              icon="lock"
              id="password"
              name="password"
              label="비밀번호"
              placeholder="Password"
              className={styles.control}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              password
              icon="lock"
              id="cpassword"
              name="cpassword"
              label="비밀번호 확인"
              placeholder="Password Check"
              className={styles.control}
              value={cPassword}
              onChange={(e) => setCPassword(e.target.value)}
            />

            <Input
              id="username"
              name="username"
              label="닉네임"
              placeholder="Nickname"
              className={styles.control}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className={styles.gruop}>
              <UserCheckbox 
                checkedUser={isMember}
                onChangeUser={(e) => setIsMember(e.target.checked)}
                checkedTrainer={isTrainer}
                onChangeTrainer={(e) => setIsTrainer(e.target.checked)}
              />
            </div>

            {/* {isMember && <div>유저 추가 정보 받기</div>}

            {isTrainer && <div>트레이너 추가 정보 받기</div>} */}

            <div className={styles.buttonGroup}>
              {/* Button */}
              <Button type="submit" width="100%">
                회원가입
              </Button>
              <Divider />
              <Button width="100%" secondary>
                <Link href={"/login"}>로그인</Link>
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default RegisterClient;
