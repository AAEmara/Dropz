import React, { useState } from 'react';
import { validatePhone, isValidEmail } from '../utils/validators.js';

export default function ContactUs() {
    const [emailError, setEmailError] = useState();
    const [error, setError] = useState();
    const [form, setForm] = useState(
        {
            "name" : "",
            "email" : "",
            "phone" : "",
            "message" : ""
        }
    );

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!isValidEmail(form.email)){
            setEmailError("invalid email");
        };
        if(!validatePhone(form.phone)){
            setError("invalid phone number");
        };
        if(validatePhone(form.phone) && isValidEmail(form.email)){
            setForm({
                name: "",
                email: "",
                phone: "",
                message: ""
            });
            setError("");
            setEmailError("");
            alert("Email has been sent successfully");
            console.log('email has sent successfully');
        };
    };

    return (
        <div className='m-4 lg:m-12 p-4 lg:p-8'>
            <h1 className='text-2xl font-semibold text-[var(--primary-color)]'>Contact us</h1>
            <p className='text-gray-500'>Let's communicate together</p>
            {/* message section */}
            <div className='md:flex mt-8 '>
                {/* left section */}
                <div className='border-2 border-[var(--primary-color)] md:w-1/3 w-full p-4 rounded-sm pb-24'>
                    {/* title and icon */}
                    <div className='flex items-center py-4'>
                        {/* icon */}
                        <div className='rounded-full bg-[var(--primary-color)] p-1 mr-4'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        {/* title */}
                        <div>
                            <p>Write To Us</p>
                        </div>
                    </div>
                    <div>
                        <p className='py-4'>Fill out our form and we will contact you within 24 hours.</p>
                        <p className='py-4'>Email: customer@exclusive.com</p>
                        <p className='py-4'>Email: support@exclusive.com</p>
                    </div>
                </div>
                {/* right section */}
                <div className='md:ml-4 md:pl-8 pt-8 w-2/3'>
                    <form action="" onSubmit={handleSubmit} className='relative lg:mr-4 w-full'>
                        <div className='lg:flex w-full'>
                            <div className='md:w-1/3 mr-4'>
                                <input type="text" name='name' id='name' value={form.name} onChange={handleChange} required
                                placeholder='Your Name' className='bg-gray-100  mt-4 pl-4 md:w-full py-2' />
                            </div>
                            <div className='md:w-1/3 mr-4'>
                                <input type="text" name='email' id='email' value={form.email} onChange={handleChange} required
                                placeholder='Your Email' className='bg-gray-100  mt-4 pl-4 md:w-full py-2' />
                                {emailError && <p className="text-red-500 pl-2 my-2">{emailError}</p>}
                            </div>
                            <div className='md:w-1/3 mr-4'>
                                <input type="text" name='phone' id='phone' value={form.phone} onChange={handleChange} required
                                placeholder='Your Phone' className='bg-gray-100  mt-4 pl-4 md:w-full py-2' />
                                {error && <p className="text-red-500 pl-2 my-2">{error}</p>}
                            </div>
                            
                            
                            
                        </div>
                        {/* {error && <p className="text-red-500 lg:absolute lg:right-4 mb-2">{error}</p>} */}
                        <textarea name="message" id="message" rows={8} value={form.message} onChange={handleChange} required
                        placeholder='Your Message' className='mt-4 bg-gray-100 pl-4 pt-2 w-full mt-8 mb-10'></textarea>
                        <button className='bg-[var(--primary-color)] text-white p-2 rounded-sm text-sm px-8 lg:absolute lg:right-0 bottom-0 '>Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
