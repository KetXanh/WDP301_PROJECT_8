import './App.css'

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            Hello Tailwind!
          </h1>
          <p className="text-gray-600 hover:text-gray-900 transition-colors">
            If you can see this text with proper styling, Tailwind is working!
          </p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Click me
          </button>
        </div>
      </div>
    </>
  )
}

export default App
