"use client";
import React, { useEffect, useState }  from 'react'
import axios from 'axios';


const MyPageClient = () => {

  const [isTrainer, setIsTrainer] = useState(false);
    
  const fetchUser = async () =>{
    if (typeof window !== 'undefined') {
      // Perform localStorage action
      const token = localStorage.getItem('token');

      try{
        const response = await axios.get('http://localhost:8080/api/user', {
          headers: {
            'token': token
          }
        });
        return response.data;
      }catch (error) {
        console.error('유저 조회 실패:', error);
        throw error;
      }
    }
  }

  useEffect(() => {
    
  });

  return (
    <>
      {isTrainer ? <div>trainer page</div> : <div>member page</div>}
    </>
  )
}

export default MyPageClient
