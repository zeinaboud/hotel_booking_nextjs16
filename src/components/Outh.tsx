import { githubAuth, signInAction } from '@/actions/serverActions';
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io5";
const Outh = () => {
  return (
    <div>
      <span className='inline-flex items-center '>
                <form action={githubAuth}>
                  <button type='submit' className='cursor-pointer'>
                    <IoLogoGithub className='mr-3' size={24} />
                  </button>
                </form>
                <form action={signInAction}>
                  <button type='submit'className=' cursor-pointer ' >
                    <FcGoogle  className=' cursor-pointer  border-l-2 border-black  dark:border-l-2 dark:border-white pl-2' size={30}/>
                  </button>
                </form>
              </span>
    </div>
  )
}

export default Outh
