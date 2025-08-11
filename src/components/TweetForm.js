import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Button, Upload, Space, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;

export default function TweetForm() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1)); // solo una imagen permitida
  };

  const handleFinish = async (values) => {
    if (!token) {
      message.error('Please log in first');
      return;
    }

    const formData = new FormData();
    formData.append('content', values.content);
    if (fileList[0]) {
      formData.append('file', fileList[0].originFileObj);
    }

    try {
      setUploading(true);
      await axios.post('http://localhost:3001/tweets', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success('Tweet posted');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error('Error posting tweet');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item
        name="content"
        rules={[{ required: true, message: 'Write something...' }]}
      >
        <TextArea rows={4} placeholder="What's happening?" />
      </Form.Item>

      <Form.Item>
        <Upload
          fileList={fileList}
          beforeUpload={() => false}
          onChange={handleUploadChange}
          maxCount={1}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Attach image</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Space style={{ width: '100%', justifyContent: 'end' }}>
          <Button type="primary" htmlType="submit" loading={uploading}>
            Post
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
