export default async function userSignUp(
  userName: string,
  userTel: string,
  userEmail: string,
  userPassword: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userName,
        tel: userTel,
        email: userEmail,
        password: userPassword,
        role: "user",
      }),
    }
  );
  if (!response.ok) {
    const reponseText = await response.json();
    if (reponseText.message == "Email already registered") return reponseText;
    throw new Error("Failed to sign-up");
  }

  return await response.json();
}
