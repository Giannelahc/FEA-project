import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import io from 'socket.io-client';
import {
  Card,
  Avatar,
  Typography,
  Image,
  Space,
  Button,
  message,
} from 'antd';
import {
  LikeOutlined,
  ShareAltOutlined,
  RetweetOutlined
} from '@ant-design/icons';

const { Paragraph } = Typography;

export default function TweetFeed() {
  const [tweets, setTweets] = useState([]);
  const token = useSelector(state => state.auth.token);

  const fetchTweets = async () => {
    try {
      const res = await axios.get('http://localhost:3001/tweets');
      setTweets(res.data);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };

  useEffect(() => {
    fetchTweets();

    const socket = io('http://localhost:3001', {
      transports: ['websocket'],
    });

    socket.on('tweetCreated', (newTweet) => {
      setTweets(prev => [newTweet, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLike = async (tweetId) => {
    if (!token) return message.error('Login required');
    try {
      const res = await axios.post(`http://localhost:3001/tweets/${tweetId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Toggled like');

      // Actualiza localmente el tweet con los likes nuevos
      setTweets(prev =>
        prev.map(tweet =>
          tweet._id === tweetId ? { ...tweet, likes: res.data.likes } : tweet
        )
      );

    } catch (err) {
      message.error('Error');
    }
  };

  const handleRetweet = async (tweetId) => { 
    if (!token) return message.error('Login required');

    try {
      const res = await axios.post(`http://localhost:3001/tweets/${tweetId}/retweet`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newRetweet = res.data; // Este es el tweet que se acaba de crear
      const originalTweetId = newRetweet.originalTweetId; // ID del tweet original

      message.success('Retweeted');

      setTweets(prev =>
        prev.map(tweet => {
          if (tweet._id === originalTweetId) {
            // Actualiza el contador de retweets usando el valor del backend
            return { ...tweet, retweetCount: (tweet.retweetCount || 0) + 1 };
          } 
          return tweet;
        })
      );

      // Agregar el retweet recién creado al inicio del feed
      setTweets(prev => [newRetweet, ...prev]);

    } catch (err) {
      message.error('Error');
      console.error(err);
    }
  };
  const handleShare = (tweetId) => {
    navigator.clipboard.writeText(`${window.location.origin}/tweets/${tweetId}`);
    message.success('Tweet link copied to clipboard');
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {tweets.map((tweet) => (
        <Card
          key={tweet._id}
          actions={[
            <Button icon={<LikeOutlined />} onClick={() => handleLike(tweet._id)}>
              {tweet.likes?.length || 0}
            </Button>,
            <Button icon={<RetweetOutlined />} onClick={() => handleRetweet(tweet._id)}>
              {tweet.retweetCount || 0}
            </Button>,
            <Button
              type="text"
              icon={<ShareAltOutlined />}
              onClick={() => handleShare(tweet._id)}
            >
              Share
            </Button>,
          ]}
        >
          <Card.Meta
            avatar={
              <Avatar>{tweet.username?.charAt(0).toUpperCase() || '?'}</Avatar>
            }
            title={tweet.userName || 'Anonymous'}
            description={<Paragraph>{tweet.content}</Paragraph>}
          />
          {tweet.mediaUrl && (
            <div style={{ marginTop: 12 }}>
              <Image
                width={300}
                src={`http://localhost:3001${tweet.mediaUrl}`}
                alt="media"
                style={{ borderRadius: 8 }}
              />
            </div>
          )}
        </Card>
      ))}
    </Space>
  );
}
