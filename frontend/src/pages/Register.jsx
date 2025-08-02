import React, { useState } from 'react';

export default function Register() {
    const [passHide, setPassHide] = useState(true);
    const [confirmPassHide, setConfirmPassHide] = useState(true);

    const handlePassword = () => {
        setPassHide(!passHide);
    };

    const handleConfirmPassword = () => {
        setConfirmPassHide(!confirmPassHide)
    }
  return (
    <div className='bg-[var(--primary-color)] w-full min-h-screen pb-4'>
        <div className='flex flex-col justify-center items-center text-white mx-4 pt-8'>
            <div className='pb-12'>
                <img src="../../public/Logo.png" alt="" />
                {/* <h1>hello</h1> */}
            </div>

            <form method='POST' className='w-full max-w-md flex flex-col gap-4 pt-4'>
                {/* Container for first and second names */}
                <div className='flex flex-col md:flex-row gap-4'>
                    <div className='flex-1'>
                        <label htmlFor="">First name</label>
                        <input type="text" className='w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4' />
                    </div>
                    <div className='flex-1'>
                        <label htmlFor="">Second name</label>
                        <input type="text" className='w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4' />
                    </div>
                </div>

                {/* Email, Password */}
                <div>
                    <label htmlFor="">Email address</label>
                    <input type="text" className='w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4' />
                </div>
                <div>
                    <label htmlFor="">Password</label>
                    {/* container which have input field and the icon */}
                    <div className='relative flex items-center'>
                        <input type={passHide? "password": "text"} className='w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4' />
                        <span className='absolute right-2 cursor-pointer' onClick={handlePassword}>
                            {passHide? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
                                <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
                            </svg>
                            :<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                            </svg>}
                        </span>
                        
                    </div>
                </div>
                <div>
                    <label htmlFor="">Confirm password</label>
                    {/* container which have input field and the icon */}
                    <div className='relative flex items-center'>
                        <input type={confirmPassHide? "password": "text"} className='w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4' />
                        <span className='absolute right-2 cursor-pointer' onClick={handleConfirmPassword}>
                            {confirmPassHide? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
                                <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
                            </svg>
                            :<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                            </svg>}
                        </span>
                    </div>
                    
                </div>
            </form>
        </div>
      
    </div>
  );
}