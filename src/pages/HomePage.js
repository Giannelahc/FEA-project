import { useSelector } from 'react-redux';
import TweetCard from '../components/TweetCard';


const HomePage = () => {
  const user = useSelector((state) => state.auth.user);
  const feed = useSelector((state) => state.tweets.feed);

  return (
    <div className="min-h-screen bg-gray-100">
      
      <div className="p-8">
        {user ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to Twitter</h2>
            <p>Share tweets, images, surveys and more.</p>
            <p>Log in or Sign up</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">Last tweets</h2>
            {feed.map((tweet) => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
