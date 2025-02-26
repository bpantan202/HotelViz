"use client";
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
// import getUserProfile from '@/libs/getUserProfile';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import getUserProfile from '@/libs/getUserProfile';
import { UserInformation } from '../../../interface';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

function stringToColor(string: string) {
    let hash = 0;
    let i;
  
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
  
    return color;
  }
  
  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 110,
        height: 110,
        fontSize: 45
      },
      children: name[0],
    };
  }
  
  

export default function MemberInfo({memberInfo} : {memberInfo:UserInformation}) {
    const { data: session, status } = useSession();
    // const [contactTel, setTel] = useState<string>("-");


    // useEffect(() => {
    //     const getUserInfo = async () => {
    //         if(session){
    //             const userInfo:UserInformation = (await getUserProfile(session?.user.token)).data;
    //             setTel(userInfo.tel);
    //         }
    //     };
    //     getUserInfo();
    // })

    return(
        <div className="flex text-base border border-gray-300 w-full h-[200px] rounded-xl bg-white shadow-md">
            {/* <div className='h-full'></div> */}
            <div className='content-center p-10'>
            <Stack direction="row" spacing={2}>
                <Avatar {...stringAvatar(`${memberInfo.name}`)}/>
            </Stack>
            </div>
            <div className='content-center font-bold w-full mr-8'>
                <div className={`px-2   text-4xl text-zinc-800`}>{memberInfo.name}</div>
                <hr className='mt-3 mb-1'/>
            <table className='border-separate border-spacing-2 text-zinc-600'>
                <tr>
                    <td>Email</td>
                    <td>{memberInfo.email}</td>
                </tr>
                <tr>
                    <td>Tel.</td>
                    <td>{memberInfo.tel}</td>
                </tr>
            </table>
            </div>
        </div>
    )
}
