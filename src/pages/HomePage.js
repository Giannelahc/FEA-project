// src/pages/HomePage.js
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Tabs, Divider } from "antd";
import TweetForm from "../components/TweetForm";
import TweetFeed from "../components/TweetFeed";

export default function HomePage() {
  // safe selectors (won’t throw if slice not mounted yet)
  const user = useSelector((s) => s.auth?.user || null);
  //const feed = useSelector((s) => (s.tweets ? s.tweets.feed : [])) || [];
  const feed = [];

  const [activeTab, setActiveTab] = useState("forYou");

  // Ant Design v5 Tabs use `items` instead of <TabPane>
  const tabItems = [
    { key: "forYou", label: "For you", children: null },
    { key: "following", label: "Following", children: null },
  ];

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      {/* Tabs: For you | Following */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 12 }}
      />

      <Divider style={{ margin: "8px 0 16px" }} />

      {/* Post Form */}
      <Row justify="center" style={{ marginBottom: 20 }}>
        <Col span={24}>
          <TweetForm user={user} />
        </Col>
      </Row>

      {/* Tweets list */}
      <TweetFeed filter={activeTab} feed={feed} />
    </div>
  );
}
