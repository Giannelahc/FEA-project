import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import { Row, Col, Tabs, Divider } from 'antd';
import TweetForm from '../components/TweetForm';
import TweetFeed from '../components/TweetFeed';

const { TabPane } = Tabs;

const HomePage = () => {
  const user = useSelector((state) => state.auth.user);
  const feed = useSelector((state) => state.tweets.feed);
  const [activeTab, setActiveTab] = useState('forYou');

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      {/* Tabs: For you | Following */}
      <Tabs
        defaultActiveKey="forYou"
        centered
        onChange={(key) => setActiveTab(key)}
        tabBarStyle={{ fontSize: '16px', fontWeight: 'bold' }}
      >
        <TabPane tab="For you" key="forYou" />
        <TabPane tab="Following" key="following" />
      </Tabs>

      <Divider />

      {/* Post Form centered below the tabs */}
      <Row justify="center" style={{ marginBottom: 20 }}>
        <Col span={24}>
          <TweetForm />
        </Col>
      </Row>

      {/* List of Tweets */}
      <TweetFeed filter={activeTab} />
    </div>
  );
};

export default HomePage;
