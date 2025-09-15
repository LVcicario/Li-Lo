export default function TailwindTest() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-6xl font-bold text-white mb-4">
          Tailwind CSS is Working! ✅
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          All utility classes are functioning properly on port 3001
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white">Gradients</h2>
            <p className="text-white/80">Working perfectly</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white">Glass Effect</h2>
            <p className="text-white/80">Backdrop filters active</p>
          </div>
          <div className="bg-red-500 hover:bg-red-600 transition-colors p-6 rounded-lg cursor-pointer">
            <h2 className="text-2xl font-bold text-white">Hover Effects</h2>
            <p className="text-white/80">Hover to see transition</p>
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors">
              Button 1
            </button>
            <button className="px-6 py-3 border-2 border-white text-white font-bold rounded hover:bg-white hover:text-black transition-all">
              Button 2
            </button>
          </div>
          <div className="text-sm text-gray-500">
            <p>Responsive breakpoints: </p>
            <p className="sm:text-green-500 md:text-blue-500 lg:text-purple-500 xl:text-red-500">
              This text changes color based on screen size
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}