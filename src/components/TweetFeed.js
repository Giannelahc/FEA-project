import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
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
    fetchTweets();;
  }, []);

  const handleLike = async (tweetId) => {
    if (!token) return message.error('Login required');
    try {
      await axios.post(`http://localhost:3001/tweets/${tweetId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Toggled like');
      fetchTweets();
    } catch (err) { message.error('Error'); }
  };

  const retweet = async (id) => {
    if (!token) return message.error('Login required');
    try {
      await axios.post(`http://localhost:3001/tweets/${id}/retweet`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Retweeted');
      fetchTweets();
    } catch (err) { message.error('Error'); }
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
            <Button icon={<LikeOutlined />} onClick={() => handleLike(tweet._id)}>{tweet.likes?.length || 0}</Button>,
            <Button icon={<RetweetOutlined />} onClick={() => retweet(tweet._id)}>{tweet.retweetCount || 0}</Button>,
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
              <Avatar>
                {tweet.username?.charAt(0).toUpperCase() || '?'}
              </Avatar>
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
