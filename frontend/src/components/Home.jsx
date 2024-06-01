import React from 'react'
import Card from './Card'

const Home = () => {
  return (
  <div className='px-8 py-8 flex'>
    <div class=" px-4 py-4 m-5 w-full max-w-sm bg-gradient-to-t from-sky-100 to-sky-50 border border-gray-200 rounded-lg drop-shadow-lg">
      <div class="flex flex-col items-center pb-10">
          <img class="w-24 h-24 mb-3 rounded-full shadow-lg" src="/docs/images/people/profile-picture-3.jpg" alt="Bonnie image"/>
          <h5 class="mb-1 text-xl text-sky-900 font-google font-semibold">Bonnie Green</h5>
          <span class="text-sm text-gray-500 dark:text-gray-400">Visual Designer</span>
          <div class="flex mt-4 md:mt-6">
              <a href="#" class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add friend</a>
              <a href="#" class="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Message</a>
          </div>
      </div>
    </div>
    
    <div class=" px-4 py-4 m-5 w-full max-w-sm bg-gradient-to-t from-sky-100 to-sky-50 border border-gray-200 rounded-lg drop-shadow-lg">
      <div class="flex flex-col items-center pb-10">
          <img class="w-24 h-24 mb-3 rounded-full shadow-lg" src="/docs/images/people/profile-picture-3.jpg" alt="Bonnie image"/>
          <h5 class="mb-1 text-xl text-sky-900 font-google font-semibold">Bonnie Green</h5>
          <span class="text-sm text-gray-500 dark:text-gray-400">Visual Designer</span>
          <div class="flex mt-4 md:mt-6">
              <a href="#" class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add friend</a>
              <a href="#" class="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Message</a>
          </div>
      </div>
    </div>

    <div>
      <button className='text-white font-google font-semibold text-sm w-fit px-4 py-2 my-2 flex items-center rounded-lg bg-blue-400 border border-gray-200 cursor-pointer hover:bg-blue-600 drop-shadow-lg duration-300'>
        Write a Self Stress Report
      </button>
    </div>


    <div className='flex px-5 py-5'>
      <div className='bg-codecyan w-full h-10'>
      </div>  

      <div className='bg-red-600 w-full h-10'>
      </div>
    </div>
  </div>
  )
}

export default Home