import { users } from '../constants/mockData';

const TweetCard = ({ tweet }) => {
  const user = users.find((u) => u.id === tweet.userId);

  return (
    <div className="border p-4 my-2 bg-white text-black rounded">
      <div className="font-bold">{user.name} @{user.username}</div>
      <p>{tweet.content}</p>

      {tweet.image && (
        <img src={tweet.image} alt="tweet" className="my-2 rounded" />
      )}

      {tweet.poll && (
        <div className="mt-2">
          <strong>{tweet.poll.question}</strong>
          <ul>
            {tweet.poll.options.map((opt, idx) => (
              <li key={idx}>
                {opt.option}: {opt.votes} votes
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TweetCard;
