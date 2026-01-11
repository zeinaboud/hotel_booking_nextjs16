"use client"
import { githubAuth, googleAuth } from '@/actions/serverActions';
import { signInSchema, signInSchemaType } from '@/lib/validations';
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { BiError } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io5";
const SignInPage = () =>
{
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<signInSchemaType>({
    resolver:zodResolver(signInSchema),
  })

  const handleSubmitting = async (data: signInSchemaType) =>
  {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo:"/"
    })
  }
  return (
    <>
      <div className='p-6 space-y-4 md:space-y-6 sm:p-8 p-6 '>
        <div className='flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 '>
            <div>
                <h1 >
                  <Link href="/signup" className="text-lg hover:underline underline-offset-1">
                   create an account
                  </Link>
                </h1>
            </div>
            <div>
                <p>OR</p>
            </div>
            <div>
              <span className='inline-flex items-center '>

                  <form action={githubAuth}>
                    <button type="submit">
                      <IoLogoGithub className='mr-3' size={24} />
                    </button>
                  </form>


                  <form action={googleAuth}>
                    <button type="submit">
                      <FcGoogle  className=' cursor-pointer  border-l-2 border-black  dark:border-l-2 dark:border-white pl-2' size={30}/>
                    </button>
                  </form>
              </span>
            </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(handleSubmitting)}
        className="space-y-4  md:mt-10 mt-5" action="#">
        <input
            type="email"
            className=" w-full py-2 px-3 rounded"
            placeholder="Email"
          required
          {...register("email",{required:true})}
        />
        <p className="text-red-500 text-sm fontbold">
          {errors.email && (
            <div className="flex items-center gap-0.5">
              <BiError />
              {errors.email?.message}
            </div>
          )}
        </p>
        <input
            type="password"
            className=" w-full py-2 px-3 rounded"
            placeholder="Password"
          required
          {...register("password",)}
        />

        <p className="text-red-500 text-sm">
          {errors.password && <div className="flex gap-0.5 items-center">
            <BiError />
            {errors.password?.message}
          </div>}

        </p>


        <button type="submit" className='btn-gradient-contrast  btn-gradient-contrast:hover mx-auto block'>
            Sign In
        </button>
      </form>
    </>
  )
}

export default SignInPage
