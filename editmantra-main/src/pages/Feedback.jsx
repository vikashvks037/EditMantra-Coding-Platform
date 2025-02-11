import { useState } from 'react';
import Footer from './Footer';
import Header from './Header';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when the form is submitted
    setMessage(''); // Reset message before submitting

    // Simulate the feedback submission process (without backend call)
    setTimeout(() => {
      setMessage('Thank you for your feedback!');
      setFeedback(''); // Reset the feedback input
      setLoading(false); // Stop loading after the simulated API call
    }, 2000); // Simulate a delay of 2 seconds (you can adjust this)

  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Feedback</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-lg text-gray-700 mb-2" htmlFor="feedback">Your Feedback</label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="5"
                placeholder="Write your feedback here..."
                required
              />
            </div>

            {message && (
              <div className={`text-center text-lg ${message.includes('Error') ? 'text-red-500' : 'text-green-500'} mb-6`}>
                {message}
              </div>
            )}

            <button 
              type="submit" 
              className={`w-full p-3 rounded-lg text-white ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`} 
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Feedback;
