"use client";
import Image from "next/image";
import React, { useState } from "react";

import GoogleLogoPath from "@/assets/googleLogo.png";
import { useRouter } from "next/navigation";

import styles from "./Auth.module.scss";
import Loader from "@/components/loader/Loader";
import AutoSignInCheckbox from "@/components/autoSignInCheckbox/AutoSignInCheckbox";
import Divider from "@/components/divider/Divider";
import Button from "@/components/button/Button";
import Link from "next/link";
import { toast } from "react-toastify";
import Input from "@/components/input/Input";
import axios from "@/api/axios";

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
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      // TODO: trainer 나 member 정보가 아직 없을시 (token parse -> id -> trainer/membrer 조회시 없으면 redirect /register/member or trainer
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const loginUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    fetchLogin(email, password)
        .then(async (result) => {
          setIsLoading(false);
          redirectUser(); // 로그인 성공 후 리디렉션
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.message); // 로그인 실패 시 에러 메시지 표시
        });
  };

  const signInWithGoogle = () => {
    // Google login
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
