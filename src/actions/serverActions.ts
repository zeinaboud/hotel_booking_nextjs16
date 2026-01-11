"use server";

import { signIn, signOut } from "@/auth";

export async function logoutAction()
{
    await signOut({
    redirectTo: "/signin",
  })


}
export async function signInAction()
{
    await signIn();
}

export async function githubAuth()
 {
    // Provider id is "github" (lowercase) by default — use that when calling signIn
    await signIn("github" ,{redirectTo:"/"});
  }
export async function googleAuth()
 {
    // Provider id is "google" (lowercase) by default — use that when calling signIn
    await signIn("google",{redirectTo:"/"});
  }
