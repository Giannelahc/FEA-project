// src/pages/SearchResultPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3001",
});

export default function SearchResultPage() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();

  const token = useSelector((s) => s?.auth?.token);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [rows, setRows] = useState([]);

  // attach token
  useEffect(() => {
    const id = API.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return () => API.interceptors.request.eject(id);
  }, [token]);

  // fetch all users (no q) OR filtered (with q)
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const url = "/users/search?q=";
        const { data } = await API.get(url, {
          params: q ? { q } : undefined,
          signal: controller.signal,
        });

        const list = Array.isArray(data) ? data : data?.items || [];
        setRows(list);
      } catch (e) {
        if (e.name !== "CanceledError" && e.name !== "AbortError") {
          setErr(e?.response?.data?.message || "Failed to load users");
          setRows([]);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [q]);

  const normalized = useMemo(
    () => rows.map((u) => ({ ...u, id: u.id ?? u._id })),
    [rows]
  );

  // ---- Follow / Unfollow (optimistic) ----
  const [following, setFollowing] = useState(() => new Set());
  const isFollowing = (id) => following.has(id);

  const follow = async (userId) => {
    setFollowing((prev) => new Set(prev).add(userId));
    try {
      await API.post(`/follow/${userId}`);
    } catch {
      setFollowing((prev) => {
        const n = new Set(prev);
        n.delete(userId);
        return n;
      });
    }
  };

  const unfollow = async (userId) => {
    setFollowing((prev) => {
      const n = new Set(prev);
      n.delete(userId);
      return n;
    });
    try {
      await API.delete(`/follow/${userId}`);
    } catch {
      setFollowing((prev) => new Set(prev).add(userId));
    }
  };

  // simple, neat button styles
  const btn = {
    base: {
      padding: "6px 14px",
      borderRadius: 8,
      fontWeight: 600,
      cursor: "pointer",
      transition: "transform 80ms ease",
    },
    follow: {
      border: "1px solid #1677ff",
      background: "#1677ff",
      color: "#fff",
    },
    unfollow: {
      border: "1px solid #d9d9d9",
      background: "#f7f7f7",
      color: "#333",
    },
  };

  return (
    <div style={{ maxWidth: 760, margin: "20px auto", padding: "0 12px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <h1 style={{ marginBottom: 4 }}>Search results</h1>
        <span style={{ color: "#666" }}>
          {q ? <>for “<b>{q}</b>”</> : "(showing all users)"}
        </span>
      </div>

      {loading && <div>Loading…</div>}
      {err && <div style={{ color: "crimson" }}>{err}</div>}

      {!loading && !err && normalized.length > 0 && (
        <div style={{ borderTop: "1px solid #eee" }}>
          {normalized.map((u) => (
            <div
              key={u.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #f2f2f2",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#e9e9e9",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 700,
                  }}
                >
                  {u.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>@{u.username}</div>
                  <div style={{ color: "#9a9a9a", fontSize: 12 }}>{u.id}</div>
                </div>
              </div>

              <div style={{ whiteSpace: "nowrap" }}>
                {isFollowing(u.id) ? (
                  <button
                    onClick={() => unfollow(u.id)}
                    style={{ ...btn.base, ...btn.unfollow }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => follow(u.id)}
                    style={{ ...btn.base, ...btn.follow }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !err && normalized.length === 0 && <div>No results</div>}
    </div>
  );
}
