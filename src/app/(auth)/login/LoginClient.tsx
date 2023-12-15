"use client";
import Image from "next/image";
import React, { useState } from "react";

import axios from "axios";
import GoogleLogoPath from "@/assets/googleLogo.png";
import { useRouter } from "next/navigation";

import styles from "./Auth.module.scss";
import Loader from "@/components/loader/Loader";
import AutoSignInCheckbox from "@/components/autoSignInCheckbox/AutoSignInCheckbox";
import Divider from "@/components/divider/Divider";
import Button from "@/components/button/Button";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";
import Input from "@/components/input/Input";

const LoginClient = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoLogin, setIsAutoLogin] = useState(false);
  
  const router = useRouter();


  const redirectUser = () => {
    router.push("/");
  };

  const fetchLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });
  
      console.log('로그인 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  };

  const isExistBefore = async (email: string, accountType: string) => {
    try {
      const response = await axios.get('http://localhost:8080/api/user/get/login?email='
                                        + email + '&accountType=' + accountType);

      return response.data;
    } catch (error){
      console.error('조회 실패: ', error);
      throw error;
    }
  }

  const loginUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // toast.info("성공!");
    setIsLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then(async (_result) => {
        console.log("user: ", _result);
        console.log("email: ", email);
        console.log("password: ", password);
        setIsLoading(false);
        // toast.success("로그인에 성공했습니다.");

        // TODO
        // 트레이너인지 일반 사용자인지 체크 박스 통해서 추가 정보 받는거 구현해야함
        const result = await fetchLogin(email, password);

        redirectUser();
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
      });
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (_result) => {
        console.log("user: ", _result.user.email);
        toast.success("로그인에 성공했습니다.");

        const googleEmail = _result.user.email ? _result.user.email : '';
        setEmail(googleEmail);
        setPassword(googleEmail);

        // TODO
        // 1. 이전에 가입했던 이력이 있는지 체크 
        const googleUser = await isExistBefore(email, 'GOOGLE');
        // 2. 없으면 추가 정보 받아서 저장
        if(googleUser){
          const result = await fetchLogin(email, password);
          redirectUser();
        } else {
          // 추가정보 받는 페이지 만들어야함
          // const result = await fetchSignUp({user, username, email, password, userRole, accountType});
        }

      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <>
      {isLoading && <Loader />}
      <section className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.logo}>
            Login
          </h1>

          <form onSubmit={loginUser} className={styles.form}>
            {/* Input */}
            <Input
              email
              icon="letter"
              id="email"
              name="email"
              label="이메일"
              placeholder="아이디(이메일)"
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
              placeholder="비밀번호"
              className={styles.control}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className={styles.group}>
              {/* 자동 로그인, 비밀번호 수정 */}
              <AutoSignInCheckbox
                checked={isAutoLogin}
                onChange={(e) => setIsAutoLogin(e.target.checked)}
              />

              <Link href={"/reset"} className={styles.findLink}>
                <div className={styles.linkText}>비밀번호 수정하기
                  <svg
                    width="11"
                    height="18"
                    viewBox="0 0 11 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.findLinkArrow}
                  >
                    <path
                      d="M1.5 1L9.5 9L1.5 17"
                      stroke="#4CAF50"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </Link>
            </div>

            <div className={styles.buttonGroup}>
              {/* Button */}
              <Button type="submit" width="100%">
                로그인
              </Button>

              <Divider />

              <Button width="100%" secondary>
                <Link href={"/register"}>회원가입</Link>
              </Button>
              <Divider />

              <div>
                {/* Button */}
                <Button onClick={signInWithGoogle} secondary>
                  <div className={styles.socialButton}>
                    <Image
                      priority
                      src={GoogleLogoPath}
                      alt="googleLogo"
                      width={30}
                      height={30}
                    />
                  </div>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default LoginClient;
