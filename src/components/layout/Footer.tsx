import React from 'react'
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
const Footer = () => {
  return (
      <>
            <footer className=' bottom-0 max-w-7xl px-4 md:px-6 lg:px-8 mx-auto'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t mt-8 '>
                    <div>
                        <h2 className='py-4 font-bold'>quick stay</h2>
                        <p>discover the UAE most extraordinary places to stay , <br/>from boutique hotels to luxury vilas</p>
                        <div className='flex gap-2 mt-3'>
                            <FaFacebookSquare  size={25}/>
                            <FaInstagramSquare size={25} />
                            <IoLogoYoutube size={25} />
                        </div>
                    </div>
                    <div>
                        <h2 className='py-4 uppercase font-bold'>company</h2>
                        <p>About</p>
                        <p>Carers</p>
                        <p>Press & News</p>
                        <p>Blog</p>
                  </div>
                  <div>
                        <h2 className='py-4 uppercase font-bold'>support</h2>
                        <p>help Center</p>
                        <p>safty information</p>
                        <p>Accessibility</p>
                        <p>Contact-us</p>
                  </div>
                  <div>
                        <h2 className='py-4 uppercase font-bold'>stay update</h2>
                      <p>subscribe to our news for travel inspiration <br/> and special offers</p>
                    </div>    
                        
                            
                    
                </div>
        </footer>
      </>
  )
}

export default Footer