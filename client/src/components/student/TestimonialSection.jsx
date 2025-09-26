import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonialSection = () => {
  return (
    <div className='pb-14 px-8 md:px-0'>
      <div className="animate-fade-in-up">
        <h2 className='text-3xl font-medium text-gray-800 transition-all duration-300 hover:text-blue-600 hover:scale-105'>Testimonials</h2>
        <p className='md:text-base text-gray-500 mt-3 transition-all duration-300 hover:text-gray-700'>Hear from our learners as they share their journeys of transformation, success, and how our <br /> platform has made a difference in their lives.</p>
      </div>
      <div className='mt-8 flex flex-row justify-center gap-6 px-4 overflow-x-auto scroll-smooth snap-x'>
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className='flex-none w-80 text-sm text-left border-2 border-gray-200 pb-6 rounded-2xl bg-white shadow-lg hover:shadow-2xl hover:shadow-blue-300/30 hover:border-blue-400 hover:-translate-y-1 transition-all duration-500 overflow-hidden group animate-scale-in-bounce'
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className='flex items-center gap-4 px-5 py-4 bg-gradient-to-r from-gray-50 to-blue-50 transition-all duration-500 group-hover:from-blue-50 group-hover:to-blue-100'>
              <img
                className='h-12 w-12 rounded-full transition-all duration-500 group-hover:scale-105 group-hover:rotate-2 animate-float-slow'
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <h1 className='text-lg font-medium text-gray-800 transition-all duration-300 group-hover:text-blue-600 group-hover:scale-102'>{testimonial.name}</h1>
                <p className='text-gray-600 transition-all duration-300 group-hover:text-gray-800'>{testimonial.role}</p>
              </div>
            </div>
            <div className='p-5 pb-7'>
              <div className='flex gap-0.5 mb-4'>{[...Array(5)].map((_, i) => (
                <img
                  className='h-5 w-5 transition-all duration-300 hover:scale-110 hover:rotate-6 group-hover:animate-bounce'
                  key={i}
                  src={assets.star}
                  alt=""
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}</div>
              <p className='text-gray-600 mt-5 transition-all duration-300 group-hover:text-gray-800 leading-relaxed'>{testimonial.feedback}</p>
            </div>
            <a
              href="#"
              className='text-blue-500 underline px-5 transition-all duration-300 hover:text-blue-700 hover:scale-102 hover:no-underline group-hover:animate-pulse-subtle'
            >
              Read More
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestimonialSection