"use client";
import Loader from "@/components/loader/Loader";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "../login/Auth.module.scss";
import Button from "@/components/button/Button";
import Divider from "@/components/divider/Divider";
import Link from "next/link";

import { toast } from "react-toastify";
import { User, createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import Input from "@/components/input/Input";
import axios from "axios";
import UserCheckbox from "@/components/userCheckbox/UserCheckbox";

interface NormalUserInfo {
  username: string;
  // additional information
}

interface TrainerInfo{
  username: string;
  // additional information
}

interface SignUpProp {
  user: User;
  username: string;
  email: string;
  password: string;
  userRole: string;
  accountType: string;
}


export const fetchSignUp = async ({
  user, 
  username, 
  email, 
  password, 
  userRole, 
  accountType
}: SignUpProp) => {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/sign-up', {
      username,
      email,
      password,
      userRole,
      accountType
    });
    console.log('로그인 성공:', response.data);
    return response.data;
  } catch (error) {
    deleteUser(user);
    console.error('로그인 실패:', error);
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

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user: User = userCredential.user;
        console.log("user", user);

        // send signup info to backend(localhost:8080/auth/sign-up)
        // 생각해볼 점: firebase에서 가입시 accessToken, refreshToken을 모두 주는데 
        //           backend에서 추가적으로 한번 더 말아올리는게 의미가 있나? -> 관리적 측면에서 있을지도
        const accountType = "NORMAL";
        const result = await fetchSignUp({user, username, email, password, userRole, accountType});

        setIsLoading(false);

        toast.success("등록 성공...");
        if(isTrainer){
          router.push(`/register/trainer?userId=`+result.data.id);
        } else if(isMember){
          router.push("/register/member")
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
