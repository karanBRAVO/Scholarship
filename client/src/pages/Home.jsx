const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">
          Scholarship Test App
        </h1>
        <p className="text-gray-600">
          Prepare for your scholarship test with confidence!
        </p>
      </header>

      <main className="flex flex-col items-center">
        <section className="bg-white p-8 shadow-md rounded-md mb-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Test</h2>
          <p className="text-gray-700 mb-4">
            Get ready for the upcoming scholarship test. Practice and improve
            your skills to maximize your chances of success.
          </p>
          <a
            href="/test-dashboard"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 inline-block"
          >
            Start Test
          </a>
        </section>

        <section className="bg-white p-8 shadow-md rounded-md mb-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Practice Tests</h2>
          <p className="text-gray-700 mb-4">
            Access a variety of practice tests to enhance your knowledge and
            boost your performance in the scholarship test.
          </p>
          <a
            href="#"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 inline-block"
          >
            Explore Practice Tests
          </a>
        </section>
      </main>

      <div className="flex space-x-4">
        <a
          href="/login"
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
        >
          Login
        </a>
        <a
          href="/signup"
          className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
        >
          Sign Up
        </a>
      </div>

      <footer className="text-center text-gray-500 mt-8">
        <p>&copy; 2023 Scholarship Test App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
