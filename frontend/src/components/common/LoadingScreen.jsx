import React from 'react'

const LoadingScreen = ({ text = 'Loading...' }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">

            <div className="flex flex-col items-center gap-4">

                {/* SPINNER */}
                <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-slate-200"></div>
                    <div className="h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
                </div>

                {/* TEXT */}
                <p className="text-sm font-medium text-slate-500 tracking-wide">
                    {text}
                </p>

            </div>

        </div>
    )
}

export default LoadingScreen