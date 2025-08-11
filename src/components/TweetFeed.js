import { useEffect, useState } from 'react';
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
  MessageOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';

const { Paragraph } = Typography;

export default function TweetFeed() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const res = await axios.get('http://localhost:3001/tweets');
        setTweets(res.data);
      } catch (error) {
        console.error('Error fetching tweets:', error);
      }
    };

    fetchTweets();
    const interval = setInterval(fetchTweets, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLike = (tweetId) => {
    message.success(`You liked tweet ${tweetId}`);
    // Aquí puedes hacer POST /tweets/:id/like
  };

  const handleComment = (tweetId) => {
    message.info(`Comment feature coming soon for tweet ${tweetId}`);
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
            <Button
              type="text"
              icon={<LikeOutlined />}
              onClick={() => handleLike(tweet._id)}
            >
              Like
            </Button>,
            <Button
              type="text"
              icon={<MessageOutlined />}
              onClick={() => handleComment(tweet._id)}
            >
              Comment
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
