"use client";
import userSignUp from "@/libs/userSignUp";
import SignUpForm from "@/components/SignUpFrom";
import { useState } from "react";

export default function Signup() {
  const makeBooking = async () => {
    const test = await userSignUp(name, tel, email, password);
    if (test.success) {
      window.location.href = "/api/auth/signin?callbackUrl=%2F";
    } else alert('Email or Telephone already registered');
  };

  const [name, setName] = useState<string>("");
  const [tel, setTel] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <main className="w-[100%] flex flex-col items-center p-20">
      <div className="w-[30%] justify-center  bg-slate-100 shadow-lg rounded-xl">
        <div className=" text-4xl text-left pl-10 font-semibold pt-10">Sign Up</div>
        
          
          <SignUpForm
            userName={name}
            userTel={tel}
            userEmail={email}
            userPassword={password}
            onNameChange={(value: string) => {
              setName(value);
            }}
            onTelChange={(value: string) => {
              setTel(value);
            }}
            onEmailChange={(value: string) => {
              setEmail(value);
            }}
            onPasswordChange={(value: string) => {
              setPassword(value);
            }}
          ></SignUpForm>
        <div className="flex flex-row-reverse p-5">
          <button
            name="Book Vaccine"
            className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2 text-white shadow-sm m-5"
            onClick={makeBooking}
            >
            Sign Up
          </button>
        </div>
            </div>
      
    </main>
  );
}
