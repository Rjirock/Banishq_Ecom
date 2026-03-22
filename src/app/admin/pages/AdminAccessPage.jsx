// app/admin/pages/AdminAccessPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ACCESS MANAGEMENT
//
// What this page does:
//   1. Change the admin login password
//   2. Add / remove admin users (each with email + role)
//   3. Toggle any admin user's active status
//
// HOW TO INTEGRATE WITH YOUR BACKEND:
//   Every function below has a clear "TODO: API call" comment.
//   Replace the local setState calls with your actual API calls.
//   The data shapes are defined in the TYPES section at the top.
//
// CURRENT STATE: all changes are local (in-memory) only.
//   Nothing is persisted until you connect the API endpoints.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import {
  ShieldCheck, Plus, Edit2, Trash2, Save, X,
  Eye, EyeOff, KeyRound, UserCog, Check,
  AlertCircle, ToggleLeft, ToggleRight,
  Mail, Lock, RefreshCw, Copy, Crown,
} from "lucide-react";
import { SectionTitle, GoldBtn, ConfirmDialog } from "../components/AdminUI";
import { C, labelStyle, inputStyle } from "../data/theme";

/* ─────────────────────────────────────────────────────────────
   TYPES (for your developer's reference)
   ─────────────────────────────────────────────────────────────
   AdminUser {
     id:        string          — unique identifier
     email:     string          — login email
     role:      "super" | "admin" | "viewer"
     active:    boolean         — can this user log in?
     createdAt: string          — ISO date string
   }

   ROLES:
     super  — full access, can manage other admins
     admin  — full access to panel, cannot manage admins
     viewer — read-only access (no create/edit/delete)
   ─────────────────────────────────────────────────────────────
*/

/* ── Initial mock admin users ── */
const INITIAL_USERS = [
  {
    id:        "admin-001",
    email:     "admin@banishq.com",
    role:      "super",
    active:    true,
    createdAt: "2026-01-01",
  },
  {
    id:        "admin-002",
    email:     "manager@banishq.com",
    role:      "admin",
    active:    true,
    createdAt: "2026-02-15",
  },
  {
    id:        "admin-003",
    email:     "viewer@banishq.com",
    role:      "viewer",
    active:    false,
    createdAt: "2026-03-10",
  },
];

const ROLES = [
  { value: "super",  label: "Super Admin", desc: "Full access + manage admins",   color: "#C9A84C" },
  { value: "admin",  label: "Admin",       desc: "Full panel access",              color: "#2563eb" },
  { value: "viewer", label: "Viewer",      desc: "Read-only, no edit/delete",      color: "#6b7280" },
];

function getRoleInfo(role) {
  return ROLES.find(r => r.value === role) ?? ROLES[1];
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ─────────────────────────────────────────────────────────────
   FIELD HELPER
───────────────────────────────────────────────────────────── */
function Field({ label, required, hint, error, children }) {
  return (
    <div>
      <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 5 }}>
        {label}
        {required && <span style={{ color: C.red, fontSize: 10 }}>*</span>}
        {hint && (
          <span style={{ fontSize: 10, color: C.dim, fontWeight: 500,
            letterSpacing: 0, textTransform: "none" }}>
            {hint}
          </span>
        )}
      </label>
      {children}
      {error && (
        <p style={{ margin: "4px 0 0", fontSize: 11.5, color: C.red,
          display: "flex", alignItems: "center", gap: 4 }}>
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PASSWORD INPUT
───────────────────────────────────────────────────────────── */
function PasswordInput({ value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <Lock size={14} color={C.dim} style={{
        position: "absolute", left: 12, top: "50%",
        transform: "translateY(-50%)", pointerEvents: "none",
      }} />
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          ...inputStyle, paddingLeft: 36, paddingRight: 40,
          border: `1.5px solid ${error ? C.red : C.border}`,
        }}
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        style={{
          position: "absolute", right: 11, top: "50%",
          transform: "translateY(-50%)",
          background: "none", border: "none",
          cursor: "pointer", color: C.dim,
          display: "flex", transition: "color .2s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = C.gold}
        onMouseLeave={e => e.currentTarget.style.color = C.dim}
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 1 — CHANGE PASSWORD
   ─────────────────────────────────────────────────────────────
   TODO: Connect to POST /api/admin/change-password
         Body: { currentPassword, newPassword }
         On success: clear form, show success message
───────────────────────────────────────────────────────────── */
function ChangePasswordSection() {
  const [current,  setCurrent]  = useState("");
  const [newPass,  setNewPass]  = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [errors,   setErrors]   = useState({});
  const [saved,    setSaved]    = useState(false);
  const [loading,  setLoading]  = useState(false);

  const validate = () => {
    const e = {};
    if (!current)                       e.current = "Enter your current password";
    if (newPass.length < 8)             e.newPass = "Min 8 characters";
    if (!/[A-Z]/.test(newPass))         e.newPass = "Include at least one uppercase letter";
    if (!/[0-9]/.test(newPass))         e.newPass = (e.newPass ? e.newPass + " & " : "") + "Include at least one number";
    if (newPass !== confirm)            e.confirm = "Passwords do not match";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      // ─────────────────────────────────────────────
      // TODO: Replace with real API call
      // const res = await fetch("/api/admin/change-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
      // });
      // if (!res.ok) throw new Error("Incorrect current password");
      // ─────────────────────────────────────────────

      await new Promise(r => setTimeout(r, 800)); // remove this line in production

      // Also update the demo cookie token value (only for demo mode)
      // In production, the backend sets a new httpOnly cookie
      setCurrent(""); setNewPass(""); setConfirm(""); setErrors({});
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setErrors({ current: err.message || "Incorrect current password" });
    } finally {
      setLoading(false);
    }
  };

  const strength = !newPass ? 0
    : [newPass.length >= 8, /[A-Z]/.test(newPass), /[0-9]/.test(newPass), /[^a-zA-Z0-9]/.test(newPass)]
        .filter(Boolean).length;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", C.red, C.orange, "#ca8a04", C.green][strength];

  return (
    <div style={{
      background: C.surface, border: `1.5px solid ${C.border}`,
      borderRadius: 18, overflow: "hidden",
      boxShadow: `0 2px 12px ${C.shadow}`,
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 22px", display: "flex", alignItems: "center", gap: 10,
        background: C.goldBg, borderBottom: `1.5px solid ${C.border}`,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, background: C.goldBg,
          border: `1.5px solid rgba(201,168,76,.3)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <KeyRound size={15} color={C.gold} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif",
            fontSize: 18, fontWeight: 700, color: C.text }}>
            Change Admin Password
          </h3>
          <p style={{ margin: 0, fontSize: 11.5, color: C.muted }}>
            Update the password used to log into the admin panel
          </p>
        </div>
      </div>

      <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>

        <Field label="Current Password" required error={errors.current}>
          <PasswordInput
            value={current}
            onChange={e => { setCurrent(e.target.value); setErrors(p => ({ ...p, current: "" })); }}
            placeholder="Your current password"
            error={errors.current}
          />
        </Field>

        <Field label="New Password" required hint="(min 8 chars, 1 uppercase, 1 number)" error={errors.newPass}>
          <PasswordInput
            value={newPass}
            onChange={e => { setNewPass(e.target.value); setErrors(p => ({ ...p, newPass: "" })); }}
            placeholder="New password"
            error={errors.newPass}
          />
          {/* Strength bar */}
          {newPass && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 4, borderRadius: 99,
                    background: i <= strength ? strengthColor : C.border,
                    transition: "background .3s",
                  }} />
                ))}
              </div>
              <p style={{ margin: 0, fontSize: 11.5, color: strengthColor, fontWeight: 700 }}>
                {strengthLabel}
              </p>
            </div>
          )}
        </Field>

        <Field label="Confirm New Password" required error={errors.confirm}>
          <PasswordInput
            value={confirm}
            onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: "" })); }}
            placeholder="Re-enter new password"
            error={errors.confirm}
          />
        </Field>

        {/* Save button */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 4 }}>
          <GoldBtn onClick={handleSave}>
            {loading
              ? <><RefreshCw size={13} style={{ animation: "spin .7s linear infinite" }} /> Saving…</>
              : saved
              ? <><Check size={13} /> Password Updated!</>
              : <><Save size={13} /> Update Password</>
            }
          </GoldBtn>
          {saved && (
            <p style={{ margin: 0, fontSize: 13, color: C.green, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 5 }}>
              <Check size={13} /> Password changed successfully
            </p>
          )}
        </div>

        {/* Dev note */}
        <div style={{
          padding: "10px 13px", borderRadius: 10,
          background: "rgba(37,99,235,.05)",
          border: "1px solid rgba(37,99,235,.15)",
        }}>
          <p style={{ margin: 0, fontSize: 11.5, color: C.blue, lineHeight: 1.6 }}>
            <strong>Developer:</strong> Connect to <code style={{ background: "rgba(37,99,235,.1)", padding: "1px 5px", borderRadius: 4 }}>POST /api/admin/change-password</code> with{" "}
            <code style={{ background: "rgba(37,99,235,.1)", padding: "1px 5px", borderRadius: 4 }}>{"{ currentPassword, newPassword }"}</code>.
            Hash the new password with bcrypt before saving to DB.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 2 — ADMIN USER MANAGEMENT
   ─────────────────────────────────────────────────────────────
   TODO: Connect to:
     GET    /api/admin/users          → load users list
     POST   /api/admin/users          → add new user (body: { email, role })
     PATCH  /api/admin/users/:id      → update role / toggle active
     DELETE /api/admin/users/:id      → remove user
───────────────────────────────────────────────────────────── */
function AdminUsersSection() {
  const [users,      setUsers]      = useState(INITIAL_USERS);
  const [showForm,   setShowForm]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);

  /* ── Add user ── */
  const handleAdd = (data) => {
    const newUser = { ...data, id: `admin-${Date.now()}`, createdAt: new Date().toISOString().split("T")[0] };
    setUsers(prev => [...prev, newUser]);
    setShowForm(false);
    // TODO: await fetch("/api/admin/users", { method: "POST", body: JSON.stringify({ email: data.email, role: data.role }) })
  };

  /* ── Update user ── */
  const handleUpdate = (data) => {
    setUsers(prev => prev.map(u => u.id === data.id ? { ...u, ...data } : u));
    setEditTarget(null);
    // TODO: await fetch(`/api/admin/users/${data.id}`, { method: "PATCH", body: JSON.stringify({ email: data.email, role: data.role }) })
  };

  /* ── Toggle active ── */
  const handleToggle = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
    // TODO: await fetch(`/api/admin/users/${id}`, { method: "PATCH", body: JSON.stringify({ active: !current.active }) })
  };

  /* ── Delete user ── */
  const handleDelete = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setDeleteId(null);
    // TODO: await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
  };

  return (
    <div style={{
      background: C.surface, border: `1.5px solid ${C.border}`,
      borderRadius: 18, overflow: "hidden",
      boxShadow: `0 2px 12px ${C.shadow}`,
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 22px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: C.goldBg, borderBottom: `1.5px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: C.goldBg,
            border: `1.5px solid rgba(201,168,76,.3)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <UserCog size={15} color={C.gold} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif",
              fontSize: 18, fontWeight: 700, color: C.text }}>
              Admin Users
            </h3>
            <p style={{ margin: 0, fontSize: 11.5, color: C.muted }}>
              {users.filter(u => u.active).length} active · {users.length} total
            </p>
          </div>
        </div>
        <GoldBtn small onClick={() => { setShowForm(true); setEditTarget(null); }}>
          <Plus size={13} /> Add Admin
        </GoldBtn>
      </div>

      <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Add / Edit form */}
        {(showForm || editTarget) && (
          <UserForm
            initial={editTarget}
            existingEmails={users.filter(u => u.id !== editTarget?.id).map(u => u.email)}
            onSave={editTarget ? handleUpdate : handleAdd}
            onCancel={() => { setShowForm(false); setEditTarget(null); }}
          />
        )}

        {/* User list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {users.map(user => {
            const role = getRoleInfo(user.role);
            return (
              <div key={user.id} style={{
                display: "flex", flexWrap: "wrap", alignItems: "center",
                gap: 12, padding: "14px 16px",
                background: user.active ? C.card : `${C.bg}`,
                border: `1.5px solid ${user.active ? C.border : "rgba(180,170,160,.3)"}`,
                borderRadius: 14, opacity: user.active ? 1 : 0.7,
                transition: "opacity .2s",
              }}>
                {/* Avatar */}
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: user.active
                    ? `linear-gradient(135deg,${C.gold},${C.goldLight})`
                    : C.border,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 800,
                  color: user.active ? "#1a1205" : C.dim,
                  boxShadow: user.active ? `0 3px 10px rgba(201,168,76,.25)` : "none",
                }}>
                  {user.email[0].toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.email}
                    </p>
                    {user.role === "super" && (
                      <Crown size={12} color={C.gold} title="Super Admin" />
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: role.color, background: `${role.color}18`,
                      padding: "2px 9px", borderRadius: 99,
                    }}>{role.label}</span>
                    <span style={{ fontSize: 11, color: C.dim }}>
                      Added {fmtDate(user.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Active toggle + actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(user.id)}
                    title={user.active ? "Deactivate" : "Activate"}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                      border: `1px solid ${user.active ? "rgba(22,163,74,.3)" : C.border}`,
                      background: user.active ? "rgba(22,163,74,.08)" : "transparent",
                      color: user.active ? C.green : C.muted,
                      fontSize: 11.5, fontWeight: 700, transition: "all .2s",
                    }}
                  >
                    {user.active
                      ? <><ToggleRight size={13}/> Active</>
                      : <><ToggleLeft  size={13}/> Inactive</>
                    }
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => { setEditTarget(user); setShowForm(false); }}
                    title="Edit"
                    style={{
                      width: 30, height: 30, borderRadius: 8,
                      border: `1px solid ${C.border}`, background: "none",
                      cursor: "pointer", color: C.gold,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background .15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = C.goldBg}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    <Edit2 size={12} />
                  </button>

                  {/* Delete — prevent deleting last super admin */}
                  <button
                    onClick={() => setDeleteId(user.id)}
                    title="Remove"
                    disabled={user.role === "super" && users.filter(u => u.role === "super").length <= 1}
                    style={{
                      width: 30, height: 30, borderRadius: 8,
                      border: `1px solid rgba(220,38,38,.2)`, background: "rgba(220,38,38,.07)",
                      cursor: "pointer", color: C.red,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: user.role === "super" && users.filter(u => u.role === "super").length <= 1 ? 0.4 : 1,
                      transition: "background .15s",
                    }}
                    onMouseEnter={e => { if (e.currentTarget.style.opacity !== "0.4") e.currentTarget.style.background = "rgba(220,38,38,.15)"; }}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(220,38,38,.07)"}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dev note */}
        <div style={{
          padding: "10px 13px", borderRadius: 10,
          background: "rgba(37,99,235,.05)",
          border: "1px solid rgba(37,99,235,.15)",
        }}>
          <p style={{ margin: 0, fontSize: 11.5, color: C.blue, lineHeight: 1.6 }}>
            <strong>Developer:</strong> Load users from{" "}
            <code style={{ background: "rgba(37,99,235,.1)", padding: "1px 5px", borderRadius: 4 }}>GET /api/admin/users</code>.
            Each action has a <code style={{ background: "rgba(37,99,235,.1)", padding: "1px 5px", borderRadius: 4 }}>// TODO</code> comment above it with the exact endpoint and body.
          </p>
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteId && (
        <ConfirmDialog
          title="Remove Admin User?"
          message="This admin will lose all access to the panel immediately."
          confirmLabel="Remove"
          danger
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   USER FORM — add or edit an admin user
───────────────────────────────────────────────────────────── */
function UserForm({ initial, existingEmails, onSave, onCancel }) {
  const isEdit = !!initial;
  const [email,  setEmail]  = useState(initial?.email  ?? "");
  const [role,   setRole]   = useState(initial?.role   ?? "admin");
  const [active, setActive] = useState(initial?.active ?? true);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim() || !email.includes("@")) e.email = "Enter a valid email address";
    if (existingEmails.includes(email.trim().toLowerCase())) e.email = "This email is already an admin";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...(initial ?? {}), email: email.trim().toLowerCase(), role, active });
  };

  const selectedRole = getRoleInfo(role);

  return (
    <div style={{
      padding: "16px 18px", borderRadius: 14,
      background: C.goldBg, border: `1.5px solid rgba(201,168,76,.25)`,
      animation: "uFade .25s ease both",
    }}>
      <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: C.text }}>
        {isEdit ? `Edit — ${initial.email}` : "Add New Admin User"}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <Field label="Email Address" required error={errors.email}>
          <div style={{ position: "relative" }}>
            <Mail size={14} color={C.dim} style={{
              position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", pointerEvents: "none",
            }} />
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
              placeholder="admin@example.com"
              style={{
                ...inputStyle, paddingLeft: 36,
                border: `1.5px solid ${errors.email ? C.red : C.border}`,
              }}
            />
          </div>
        </Field>

        <Field label="Role">
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            {ROLES.map(r => (
              <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Role info */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
        padding: "8px 13px", borderRadius: 10,
        background: `${selectedRole.color}12`,
        border: `1px solid ${selectedRole.color}30`,
      }}>
        <ShieldCheck size={13} color={selectedRole.color} />
        <span style={{ fontSize: 12.5, fontWeight: 600, color: selectedRole.color }}>
          {selectedRole.label}: {selectedRole.desc}
        </span>
      </div>

      {/* Active toggle (edit only) */}
      {isEdit && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 13px", marginBottom: 12, borderRadius: 10,
          background: active ? "rgba(22,163,74,.06)" : "rgba(107,114,128,.06)",
          border: `1px solid ${active ? "rgba(22,163,74,.2)" : C.border}`,
        }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700,
            color: active ? C.green : C.muted }}>
            {active ? "Account Active" : "Account Inactive"}
          </p>
          <button onClick={() => setActive(v => !v)} style={{
            width: 44, height: 24, borderRadius: 99, border: "none",
            cursor: "pointer", position: "relative",
            background: active ? C.green : C.border, transition: "background .25s",
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%", background: "#fff",
              position: "absolute", top: 3, left: active ? 23 : 3,
              transition: "left .25s", boxShadow: "0 1px 4px rgba(0,0,0,.2)",
            }} />
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <GoldBtn small onClick={handleSave}>
          <Save size={12} /> {isEdit ? "Save Changes" : "Add Admin"}
        </GoldBtn>
        <GoldBtn small outline onClick={onCancel}>
          <X size={12} /> Cancel
        </GoldBtn>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE EXPORT
───────────────────────────────────────────────────────────── */
export default function AdminAccessPage() {
  return (
    <div>
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes uFade { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <SectionTitle
        icon={ShieldCheck}
        title="Admin Access"
        subtitle="Manage admin panel password and control who can access the admin dashboard"
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <ChangePasswordSection />
        <AdminUsersSection />
      </div>
    </div>
  );
}