"use client"
import { signIn } from "@/auth";
import Sppiner from "@/components/Sppiner";
import { signUpSchema, signUpSchemaType } from '@/lib/validations';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import toast from "react-hot-toast";
import { BiError } from "react-icons/bi";
const SignUpPage = () =>
{

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<signUpSchemaType>({
    resolver:zodResolver(signUpSchema),
  })

  const handleSubmitting = async (data: signUpSchemaType) =>
  {
    setLoading(true);

    try
    {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(()=>({}));

      if (!res.ok)
      {
        toast.error(json.error);
        setLoading(false);
      }
      else toast.success("تم إنشاء الحساب بنجاح");

      await new Promise(r => setTimeout(r, 100));
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false// ضع هنا الصفحة المحمية
      });


      if (result?.error) {
        toast.error(result.error || "حدث خطأ أثناء تسجيل الدخول");
      } else {
        toast.success("تم تسجيل الدخول بنجاح");
        // تحويل المستخدم للصفحة المحمية
        window.location.href = result?.url || "/";
      }
      } catch (err)
      {
        console.error(err);
        toast.error("حدث خطأ غير متوقع");
      } finally
      {
        setLoading(false);
      }
  };
  return (
    <>
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
        <input
            type="text"
            className=" w-full py-2 px-3 rounded"
            placeholder="Name"
          required
          {...register("name",)}
        />
        <p className="text-red-500 text-sm">
          {errors.name && <div className="flex gap-0.5 items-center">
            <BiError />
            {errors.name?.message}
          </div>}

        </p>


        <button
          disabled={loading}
          type="submit"
          className='disabled:bg-gray-200 btn-gradient-contrast  btn-gradient-contrast:hover mx-auto block'>
          {loading ? <Sppiner /> : <>Sign Up</>}
        </button>
       </form>
    </>
  )
}

export default SignUpPage
