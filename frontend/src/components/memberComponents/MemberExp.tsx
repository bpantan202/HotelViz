"use client"
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
// import MemberExpDisplay from './MemberExpDisplay';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import { useEffect, useState } from 'react';
import { UserInformation } from '../../../interface';
import { userInfo } from 'os';

export default function MemberExp({memberInfo} : {memberInfo:UserInformation}) {
    const [tier, setTier] = useState<string>("");
    const [nextTier, setNextTier] = useState<string>("");
    const [exp, setExp] = useState(0);
    const [fullExp, setFullExp] = useState(0);
    const [pointBalance, setPointBalance] = useState(0);
    const [colorA, setColorA] = useState<string>("#1e40af");
    const [colorB, setColorB] = useState<string>("text-blue-800");
    

    const setColorDisplay = () => {
        if(tier == "Platinum" || tier == "platinum") {
            setColorA("#14b8a6");
            setColorB("text-teal-500");
            setFullExp(500);
        } else if (tier == "Gold" || tier == "gold") {
            setColorA("#eab308");
            setColorB("text-yellow-500");
            setFullExp(500);
            setNextTier("Platinum");
        } else if (tier == "Silver" || tier == "silver") {
            setColorA("#64748b");
            setColorB("text-slate-500");
            setFullExp(200);
            setNextTier("Gold");
        } else if (tier == "Bronze" || tier == "bronze") {
            setColorA("#854d0e");
            setColorB("text-yellow-800");
            setFullExp(50);
            setNextTier("Sliver");
        } else {
            setColorA("#1e40af");
            setColorB("text-blue-800");
            setFullExp(0);
            setNextTier("");
        }
    }

    useEffect(() => {
        setTier(memberInfo.tier); 
        setExp(memberInfo.experience); 
        setPointBalance(memberInfo.point);
        setColorDisplay();
    })


    return (
        <div className="flex border border-gray-300 w-full min-w-[450px] h-[200px] rounded-xl bg-white shadow-md">
        <div className='ml-[20px]' >
            <Gauge value={Math.min(exp,fullExp)} valueMax={fullExp} 
            startAngle={-120} endAngle={120} width={180}
            sx={(theme) => ({
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: `${colorA}`,
                },
              })}
            text={''}
            />
        </div>   
        <div className='absolute mt-16 ml-[80px] w-[60px]'>
            <div className='text-center mb-1'><BedtimeIcon/></div>
            <div className='font-bold text-2xl text-center'>{exp}</div>
            <div className='border border-stone-800'></div>
            <div className='font-bold text-md text-center'>{fullExp}</div>
        </div>
        <div className='m-8 w-full'>
        
        <div className={`w-auto text-4xl font-bold ${colorB}`}>
            {tier}
        </div>
        <hr className='my-3'/>
        <div className='w-auto text-lg font-bold text-black-400'>
            Point balance : {pointBalance}
        </div>
        {
            (tier == "Platinum" || tier == "platinum")? 
            <div className='mt-2 w-auto text-sm font-bold text-neutral-400 font-sans'>You are the highest tier!</div>
            :
            <div className='mt-2 w-auto text-sm font-bold text-neutral-400 font-sans'>
            Earn more {Math.max(fullExp - exp,0)} <BedtimeIcon fontSize={"inherit"}/> to get {nextTier} tier.
            </div>
        }
        
        </div>
        </div>
    )
}

