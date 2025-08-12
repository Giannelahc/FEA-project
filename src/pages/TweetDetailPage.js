import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Card, Avatar, Typography, Image, Button, Spin, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

export default function TweetDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tweet, setTweet] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = useSelector(state => state.auth.token);

    const fetchTweet = async () => {
        setLoading(true);
        try {
        const res = await axios.get(`http://localhost:3001/tweets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        setTweet(res.data);
        } catch (error) {
        message.error('Failed to load tweet');
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchTweet();
    }, [id]);

    if (loading) {
        return (
        <div style={{ textAlign: 'center', padding: 50 }}>
            <Spin size="large" />
        </div>
        );
    }

    if (!tweet) {
        return (
        <div style={{ textAlign: 'center', padding: 50 }}>
            <p>Tweet not found.</p>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Go Back</Button>
        </div>
        );
    }

    return (
        <Card
        style={{ maxWidth: 600, margin: '20px auto' }}
        actions={[
            // Aquí podrías agregar acciones como like, retweet, comentar
            <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>Back</Button>
        ]}
        >
        <Card.Meta
            avatar={<Avatar>{tweet.userName?.charAt(0).toUpperCase() || '?'}</Avatar>}
            title={tweet.userName || 'Anonymous'}
            description={<Paragraph>{tweet.content}</Paragraph>}
        />
        {tweet.mediaUrl && (
            <div style={{ marginTop: 12 }}>
            <Image
                width={400}
                src={`http://localhost:3001${tweet.mediaUrl}`}
                alt="tweet media"
                style={{ borderRadius: 8 }}
            />
            </div>
        )}
        <div style={{ marginTop: 10, color: 'gray', fontSize: 12 }}>
            Posted on: {new Date(tweet.createdAt).toLocaleString()}
        </div>
        </Card>
    );
}
