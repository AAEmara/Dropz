import React, { useEffect } from 'react';
import SideBarMob from '../components/SideBarMob';
import SideBarDisc from '../components/SideBarDisc';
import { initFlowbite } from 'flowbite';

export default function Cart() {

  useEffect(() => {

    initFlowbite()
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <SideBarMob/>
      <div className="flex flex-1 container mx-auto mt-4 px-4">
        <div className="">
          <SideBarDisc/>
        </div>
      </div>
    </div>
  )
}
