/**
 * Revlogic Clay Webhook Sender - Settings
 * Open Source Chrome Extension
 * Copyright (c) 2026 Revlogic.co
 * Licensed under MIT License
 * GitHub: https://github.com/revlogic/clay-webhook-sender
 */

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

async function load() {
  const data = await chrome.storage.local.get([
    "clayWebhookUrl",
    "sendMode",
    "trimRules",
    "addedBy",
    "hsUserId"
  ]);

  document.getElementById("clayWebhookUrl").value = data.clayWebhookUrl || "";
  document.getElementById("sendMode").value = data.sendMode || "single";
  document.getElementById("addedBy").value = data.addedBy || "";
  document.getElementById("hsUserId").value = data.hsUserId || "";
  
  // Load trim rule for fullName
  const rules = data.trimRules || {};
  document.getElementById("trimFullName").value = rules?.fullName?.pattern || "";
}

async function save() {
  const clayWebhookUrl = document.getElementById("clayWebhookUrl").value.trim();
  const sendMode = document.getElementById("sendMode").value;
  const addedBy = document.getElementById("addedBy").value.trim();
  const hsUserId = document.getElementById("hsUserId").value.trim();
  const trimFullNamePattern = document.getElementById("trimFullName").value.trim();

  if (!clayWebhookUrl) {
    showToast("⚠️ Clay webhook URL is required");
    return;
  }

  if (!clayWebhookUrl.startsWith("https://")) {
    showToast("⚠️ Webhook URL must start with https://");
    return;
  }

  // Build trim rules
  const trimRules = {};
  if (trimFullNamePattern) {
    trimRules.fullName = {
      pattern: trimFullNamePattern,
      replace: ""
    };
  }

  await chrome.storage.local.set({
    clayWebhookUrl,
    sendMode,
    trimRules,
    addedBy,
    hsUserId
  });

  showToast("✅ Settings saved!");
}

document.getElementById("save")?.addEventListener("click", save);

document.getElementById("test")?.addEventListener("click", () => {
  showToast("ℹ️ Open sidebar and click Refresh to test extraction");
});

// Load settings on page load
load();
