"use client";
import { TextField } from "@mui/material";

export default function SignUpForm({
  userName,
  userTel,
  userEmail,
  userPassword,
  onNameChange,
  onTelChange,
  onEmailChange,
  onPasswordChange,
}: {
  userName: string;
  userTel: string;
  userEmail: string;
  userPassword: string;
  onNameChange: Function;
  onTelChange: Function;
  onEmailChange: Function;
  onPasswordChange: Function;
}) {
  return (
    <div className="space-y-3 rounded-lg w-full flex flex-col mt-2 p-10">
      <TextField
       fullWidth 
       variant="outlined"
        name="userName"
        label="Name"
        defaultValue={userName}
        onChange={(e) => {
          onNameChange(e.target.value);
        }}
      ></TextField>

      <TextField
        fullWidth 
        variant="outlined"
        name="userTel"
        label="Tel"
        defaultValue={userTel}
        onChange={(e) => {
          onTelChange(e.target.value);
        }}
      ></TextField>

      <TextField
        fullWidth 
        variant="outlined"
        name="userEmail"
        label="Email"
        defaultValue={userEmail}
        onChange={(e) => {
          onEmailChange(e.target.value);
        }}
      ></TextField>

      <TextField
        fullWidth 
        variant="outlined"
        name="userPassword"
        label="Password"
        defaultValue={userPassword}
        onChange={(e) => {
          onPasswordChange(e.target.value);
        }}
      ></TextField>
    </div>
  );
}
