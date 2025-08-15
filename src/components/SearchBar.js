// src/components/SearchBar.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, createSearchParams, useLocation } from "react-router-dom";
import { Input, Button, Spin } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import useDebounce from "../hooks/useDebounce";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3001",
});

export default function SearchBar({ initial = "" }) {
  const [q, setQ] = useState(initial);
  const debouncedQ = useDebounce(q, 350);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(false);

  const token = useSelector((s) => s?.auth?.token);
  const navigate = useNavigate();
  const location = useLocation();
  const abortRef = useRef(null);

  // keep input synced with ?q when using back/forward nav
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const current = params.get("q") || "";
    if (!initial && current !== q) setQ(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // attach token to requests
  useEffect(() => {
    const id = API.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return () => API.interceptors.request.eject(id);
  }, [token]);

  // fetch users when debounced query changes
  useEffect(() => {
    if (!debouncedQ || debouncedQ.trim().length < 2) {
      setResults([]);
      setErr("");
      setOpen(false);
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    // cancel previous in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await API.get(`/users/search`, {
          params: { q: debouncedQ.trim() },
          signal: controller.signal,
        });

        // Normalize shape to { id, username }
        const norm = (Array.isArray(data) ? data : []).map((u) => ({
          id: u.id ?? u._id,
          username: u.username,
        }));
        setResults(norm);
        setOpen(true);
      } catch (e) {
        if (e.name !== "CanceledError" && e.name !== "AbortError") {
          setErr(e?.response?.data?.message || "Search failed");
          setResults([]);
          setOpen(true);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [debouncedQ]);

  // local follow state (optimistic)
  const [following, setFollowing] = useState(() => new Set());
  const isFollowing = (id) => following.has(id);

  const follow = async (userId) => {
    try {
      // optimistic
      setFollowing((prev) => new Set(prev).add(userId));
      await API.post(`/follow/${userId}`);
    } catch {
      // rollback on error
      setFollowing((prev) => {
        const n = new Set(prev);
        n.delete(userId);
        return n;
      });
    }
  };

  const unfollow = async (userId) => {
    try {
      // optimistic
      setFollowing((prev) => {
        const n = new Set(prev);
        n.delete(userId);
        return n;
      });
      await API.delete(`/follow/${userId}`);
    } catch {
      // rollback on error
      setFollowing((prev) => {
        const n = new Set(prev);
        n.add(userId);
        return n;
      });
    }
  };

  const onAdd = (userId) => {
    // do whatever “Add” means in your app.
    // Placeholder: navigate to user profile or open a modal.
    navigate(`/u/${userId}`);
    setOpen(false);
  };

  const onEnterSearchPage = (value) => {
    const query = (value ?? q).trim();
    if (!query) return;
    navigate({ pathname: "/search", search: `?${createSearchParams({ q: query })}` });
    setOpen(false);
  };

  // close panel when clicking outside
  const wrapperRef = useRef(null);
  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const panel = useMemo(() => {
    if (!open) return null;
    return (
      <div style={styles.panel}>
        {loading && (
          <div style={styles.centerRow}>
            <Spin />
            <span style={{ marginLeft: 8 }}>Searching…</span>
          </div>
        )}
        {!loading && err && <div style={styles.error}>{err}</div>}
        {!loading && !err && results.length === 0 && (
          <div style={styles.empty}>No results</div>
        )}
        {!loading && !err && results.length > 0 && (
          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {results.map((u) => (
              <div key={u.id} style={styles.row}>
                <div style={styles.user}>
                  <div style={styles.avatar}>{u.username?.[0]?.toUpperCase()}</div>
                  <div>
                    <div style={styles.username}>@{u.username}</div>
                    <div style={styles.subtle}>{u.id}</div>
                  </div>
                </div>

                <div style={styles.actions}>
                  <Button size="small" onClick={() => onAdd(u.id)}>
                    Add
                  </Button>
                  {isFollowing(u.id) ? (
                    <Button size="small" style={{ marginLeft: 8 }} onClick={() => unfollow(u.id)}>
                      Unfollow
                    </Button>
                  ) : (
                    <Button type="primary" size="small" style={{ marginLeft: 8 }} onClick={() => follow(u.id)}>
                      Follow
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }, [open, loading, err, results, following]);

  return (
    <div style={styles.wrapper} ref={wrapperRef}>
      <Input.Search
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          if (!open) setOpen(true);
        }}
        onSearch={onEnterSearchPage}
        placeholder="Search users or #hashtags"
        allowClear
        enterButton
        size="middle"
        aria-label="Search"
        onFocus={() => {
          if (results.length > 0 || err || loading) setOpen(true);
        }}
      />
      {panel}
    </div>
  );
}

const styles = {
  wrapper: { position: "relative", width: "100%" },
  panel: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 6,
    background: "#fff",
    color: "#eee",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
    zIndex: 1000,
    padding: 8,
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 10px",
    borderRadius: 6,
  },
  user: { display: "flex", alignItems: "center", gap: 12, minWidth: 0 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#2d2d2d",
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
  },
  username: { fontWeight: 600, lineHeight: 1.2, color:"#000" },
  subtle: { color: "#9a9a9a", fontSize: 12 },
  actions: { display: "flex", alignItems: "center" },
  centerRow: { display: "flex", alignItems: "center", padding: 10 },
  error: { color: "salmon", padding: 10 },
  empty: { color: "#9a9a9a", padding: 10 },
};
