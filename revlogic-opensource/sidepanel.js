/**
 * Revlogic Clay Webhook Sender - Sidebar
 * Open Source Chrome Extension
 * Copyright (c) 2026 Revlogic.co
 * Licensed under MIT License
 * GitHub: https://github.com/revlogic/clay-webhook-sender
 */

// Track URL changes for auto-refresh
let lastUrl = "";
let lastProfiles = null;

function isValidLinkedInUrl(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    // Must be a LinkedIn domain and contain profile path
    return (u.hostname.includes('linkedin.com') && 
            (u.pathname.includes('/in/') || 
             u.pathname.includes('/sales/people/') || 
             u.pathname.includes('/sales/lead/')));
  } catch {
    return false;
  }
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function siteKeyFromUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname;
  } catch {
    return "Unknown";
  }
}

function setStatus(kind, text, meta = "") {
  const dot = document.getElementById("dot");
  dot.classList.remove("good", "bad");
  if (kind === "good") dot.classList.add("good");
  if (kind === "bad") dot.classList.add("bad");
  document.getElementById("statusText").textContent = text;
  document.getElementById("meta").textContent = meta || "";
}

function renderTable(records) {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  if (!records?.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 3;
    td.className = "small";
    td.textContent = "No selected people found. Tick checkboxes then click Refresh.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  for (const r of records.slice(0, 200)) {
    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.textContent = r.fullName || "";
    tr.appendChild(tdName);

    const tdCo = document.createElement("td");
    tdCo.textContent = r.company || "";
    tr.appendChild(tdCo);

    const tdLi = document.createElement("td");
    if (r.linkedinUrl) {
      const a = document.createElement("a");
      a.href = r.linkedinUrl;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = "Open";
      a.style.color = "rgba(55,208,255,0.95)";
      a.style.textDecoration = "none";
      a.style.fontWeight = "650";
      tdLi.appendChild(a);
    }
    tr.appendChild(tdLi);

    tbody.appendChild(tr);
  }

  if (records.length > 200) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 3;
    td.className = "small";
    td.textContent = `Preview shows first 200 of ${records.length}. Send will include all.`;
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
}

async function ensureContentScript(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content.js"]
    });
  } catch (e) {}
}

async function refreshSitePill() {
  try {
    const tab = await getActiveTab();
    if (tab?.url) {
      document.getElementById("site").textContent = siteKeyFromUrl(tab.url);
    } else {
      // Retry once after a short delay
      setTimeout(async () => {
        const retryTab = await getActiveTab();
        document.getElementById("site").textContent = retryTab?.url ? siteKeyFromUrl(retryTab.url) : "No tab";
      }, 100);
    }
  } catch (e) {
    document.getElementById("site").textContent = "Error";
  }
}

// Initial refresh
refreshSitePill();

// AUTO-REFRESH FUNCTIONALITY - from working version
async function silentRefreshProfiles() {
  const result = await getSelectedPeople();
  if (!result.ok) {
    // Don't flash errors on navigation
    return;
  }
  
  const settings = await loadSettings();
  
  let records = (result.people || []).map((p) => ({
    ...p,
    addedBy: settings.addedBy || "",
    hsUserId: settings.hsUserId || "",
    sourceUrl: p.sourceUrl || result.sourceUrl || ""
  }));
  
  // ONLY keep records with valid LinkedIn URLs
  records = records.filter(r => isValidLinkedInUrl(r.linkedinUrl));
  records = records.map(r => applyTrimRules(r, settings.trimRules));
  
  lastProfiles = records;
  renderTable(records);
  setStatus(records.length ? "good" : "", "Preview ready", `${records.length} record(s)`);
}

async function tickUrlChange() {
  try {
    const tab = await getActiveTab();
    const url = tab?.url || "";
    if (url && url !== lastUrl) {
      lastUrl = url;
      await refreshSitePill();
      // Auto-refresh the preview on the new page
      await silentRefreshProfiles();
    }
  } catch {
    // ignore
  }
}

// When the side panel is open, keep the preview synced to the current page
setInterval(tickUrlChange, 1200);

// Listen for tab changes
chrome.tabs.onActivated.addListener(() => {
  refreshSitePill();
  tickUrlChange();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    refreshSitePill();
    tickUrlChange();
  }
});

async function loadSettings() {
  const { clayWebhookUrl, sendMode, trimRules, addedBy, hsUserId } = await chrome.storage.local.get([
    "clayWebhookUrl",
    "sendMode",
    "trimRules",
    "addedBy",
    "hsUserId"
  ]);
  return {
    clayWebhookUrl: clayWebhookUrl || "",
    sendMode: sendMode || "single",
    trimRules: trimRules || {},
    addedBy: addedBy || "",
    hsUserId: hsUserId || ""
  };
}

async function saveDefaultDomain(domain) {
  await chrome.storage.local.set({ defaultDomain: domain });
}

function applyTrimRules(record, rules) {
  const out = { ...record };
  for (const k of ["fullName","firstName","lastName","company"]) {
    const rule = rules?.[k];
    if (!rule?.pattern) continue;
    try {
      const re = new RegExp(rule.pattern, "i");
      out[k] = String(out[k] || "").replace(re, rule.replace ?? "").trim();
    } catch {}
  }
  return out;
}

async function getSelectedPeople() {
  const tab = await getActiveTab();
  if (!tab?.id) return { ok: false, error: "No active tab" };

  await ensureContentScript(tab.id);

  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tab.id, { type: "GET_SELECTED_PEOPLE" }, (res) => {
      if (chrome.runtime.lastError) resolve({ ok: false, error: chrome.runtime.lastError.message });
      else resolve(res || { ok: false, error: "No response" });
    });
  });
}

async function postJson(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const text = await res.text().catch(() => "");
  return { ok: res.ok, status: res.status, statusText: res.statusText, preview: (text || "").slice(0, 200) };
}

document.getElementById("openSettings").addEventListener("click", async () => {
  await chrome.runtime.openOptionsPage();
});

document.getElementById("refresh").addEventListener("click", async () => {
  setStatus("", "Refreshing…");
  const settings = await loadSettings();

  const sel = await getSelectedPeople();
  if (!sel.ok) {
    setStatus("bad", "Could not read selection", sel.error || "");
    renderTable([]);
    return;
  }

  let records = (sel.people || []).map((p) => ({
    ...p,
    addedBy: settings.addedBy || "",
    hsUserId: settings.hsUserId || "",
    sourceUrl: p.sourceUrl || sel.sourceUrl || ""
  }));

  // ONLY keep records with valid LinkedIn URLs
  records = records.filter(r => isValidLinkedInUrl(r.linkedinUrl));

  records = records.map(r => applyTrimRules(r, settings.trimRules));

  lastProfiles = records;
  renderTable(records);
  setStatus(records.length ? "good" : "", "Preview ready", `${records.length} record(s)`);
});

document.getElementById("sendSelected").addEventListener("click", async () => {
  const settings = await loadSettings();

  if (!settings.clayWebhookUrl || !settings.clayWebhookUrl.startsWith("https://")) {
    setStatus("bad", "Missing Clay webhook", "Open Settings to add webhook URL");
    return;
  }

  if (!lastProfiles) {
    document.getElementById("refresh").click();
    return;
  }

  const records = (lastProfiles || [])
    .filter(r => isValidLinkedInUrl(r.linkedinUrl)) // Only send records with valid LinkedIn URLs
    .map(r => applyTrimRules({
      ...r,
      addedBy: settings.addedBy || r.addedBy || "",
      hsUserId: settings.hsUserId || r.hsUserId || ""
    }, settings.trimRules));
  if (!records.length) {
    setStatus("bad", "Nothing to send", "Refresh first");
    return;
  }

  const mode = settings.sendMode || "single";

  if (mode === "batch") {
    setStatus("", "Sending batch…", `${records.length} records`);
    const payload = { records, sentAt: new Date().toISOString() };
    const r = await postJson(settings.clayWebhookUrl, payload);
    setStatus(r.ok ? "good" : "bad", r.ok ? "Batch sent" : "Batch failed", `${r.status} ${r.statusText}`);
    return;
  }

  setStatus("", "Sending…", `0/${records.length}`);
  for (let i = 0; i < records.length; i++) {
    const payload = { ...records[i], sentAt: new Date().toISOString() };
    const r = await postJson(settings.clayWebhookUrl, payload);
    if (!r.ok) {
      setStatus("bad", "Send failed", `${r.status} ${r.statusText}`);
      return;
    }
    setStatus("good", "Sending…", `${i + 1}/${records.length}`);
    await new Promise((res) => setTimeout(res, 220));
  }
  setStatus("good", "Done", `${records.length} sent`);
});
