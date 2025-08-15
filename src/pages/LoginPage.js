// src/pages/LoginPage.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Flex,
  Tabs,
  Form,
  Input,
  Button,
  Typography,
  Alert,
  message,
} from "antd";
import { loginThunk } from "../slices/authSlice";

const { TabPane } = Tabs;
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, token } = useSelector((s) => s.auth);
  const from = location.state?.from?.pathname || "/";

  const [activeKey, setActiveKey] = useState("1");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState(null);

  useEffect(() => {
    if (token) navigate(from, { replace: true });
  }, [token, from, navigate]);

  // ----- LOGIN -----
  const onLoginFinish = async (values) => {
    await dispatch(loginThunk(values)).unwrap().then(
      () => navigate(from, { replace: true }),
      () => {}
    );
  };

  // ----- REGISTER -----
  const onRegisterFinish = async ({ username, email, password }) => {
    setRegError(null);
    setRegLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        username,
        email,
        password,
      });
      message.success("Registered! Logging you in…");
      // auto-login after register
      await dispatch(loginThunk({ email, password })).unwrap();
      navigate(from, { replace: true });
    } catch (e) {
      const msg = e.response?.data?.message || "Registration failed";
      setRegError(msg);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <Flex gap="middle" align="center" vertical justify="center" style={{ marginTop: 100, padding: 16 }}>
      <Typography.Title level={3} style={{ marginBottom: 0 }}>
        Welcome
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
        Login or create an account to continue.
      </Typography.Paragraph>

      <Tabs activeKey={activeKey} onChange={setActiveKey} style={{ width: 420 }}>
        {/* LOGIN TAB */}
        <TabPane tab="Login" key="1">
          {error && (
            <Alert
              type="error"
              showIcon
              message={typeof error === "string" ? error : "Login failed"}
              style={{ marginBottom: 12 }}
            />
          )}
          <Form layout="vertical" onFinish={onLoginFinish} autoComplete="off">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input placeholder="you@example.com" autoFocus />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" block loading={loading}>
                {loading ? "Signing in…" : "Login"}
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        {/* REGISTER TAB */}
        <TabPane tab="Register" key="2">
          {regError && (
            <Alert
              type="error"
              showIcon
              message={regError}
              style={{ marginBottom: 12 }}
            />
          )}
          <Form layout="vertical" onFinish={onRegisterFinish} autoComplete="off">
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Username is required" }]}
            >
              <Input placeholder="choose a username" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
              hasFeedback
            >
              <Input.Password placeholder="min 6 characters" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="repeat your password" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={regLoading}
              >
                {regLoading ? "Creating account…" : "Register"}
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Flex>
  );
}
