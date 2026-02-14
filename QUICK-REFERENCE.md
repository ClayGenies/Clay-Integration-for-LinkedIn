# Quick Reference Card - Revlogic Clay Sender

**Print this or bookmark for quick access!**

---

## ⚡ Quick Start (30 Seconds)

1. **Select** profiles in Sales Navigator (checkboxes)
2. **Click** Revlogic extension icon
3. **Refresh** to preview
4. **Send** to Clay
5. **Done!**

---

## 🔧 Essential Settings

| Setting | What It Does | Example |
|---------|--------------|---------|
| **Clay Webhook URL** | Where profiles go | `https://api.clay.com/webhook/abc...` |
| **Default Domain** | Company domain for enrichment | `acme.com` |
| **Added By** | Your email (for tracking) | `you@company.com` |
| **Send Mode** | Single (safer) or Batch (faster) | `Single` |

**Access Settings:** Click extension icon → "Settings" button

---

## 📊 Webhook Payload Reference

### What Gets Sent

```json
{
  "fullName": "Jane Doe",
  "firstName": "Jane",
  "lastName": "Doe",
  "company": "Acme Corp",
  "domain": "acme.com",
  "linkedinUrl": "https://linkedin.com/in/janedoe",
  "addedBy": "you@company.com",
  "hsUserId": "31712004",
  "sourceUrl": "https://linkedin.com/sales/search/..."
}
```

### Clay Table Columns

Set up these columns in your Clay table:

- Full Name (Text)
- First Name (Text)
- Last Name (Text)
- Company (Text)
- Domain (Text)
- LinkedIn URL (URL)
- Added By (Email)
- Source URL (URL)

---

## 🚨 Common Errors & Quick Fixes

| Error | Fix |
|-------|-----|
| **"Missing Clay webhook"** | Settings → Paste webhook URL → Save |
| **"No preview yet"** | Select checkboxes in Sales Navigator |
| **Extension grayed out** | Navigate to Sales Navigator search page |
| **Send failed 400** | Enable "Accept any payload" in Clay |
| **Profiles missing data** | Normal for incomplete LinkedIn profiles |
| **Names have "is reachable"** | Settings → Field trimming → `\s+is\s+reachable.*$` |

---

## ⌨️ Keyboard Shortcuts

*(Not yet implemented, but coming soon!)*

- `Ctrl/Cmd + Shift + R` - Refresh preview
- `Ctrl/Cmd + Shift + S` - Send to Clay
- `Ctrl/Cmd + ,` - Open settings

---

## 💡 Pro Tips

### Tip #1: Change Domain Per Export
The domain pill at the top of the sidebar is **editable**!  
Click it → Type new domain → Press Enter

### Tip #2: Clean Names Automatically
Remove "is reachable" and other junk:  
Settings → Field trimming → `\s+is\s+reachable.*$`

### Tip #3: Track Your Searches
The extension captures `sourceUrl` — use this in Clay to track which Sales Navigator searches produce the best leads!

### Tip #4: Start Small
First time? Send 5 profiles as a test.  
Once working, scale to 50, 100, 200+.

### Tip #5: Use Clay Views
Create Clay views for:
- "New imports" (today's exports)
- "Enrichment in progress"
- "Ready to contact" (has email/phone)
- "Synced to CRM"

---

## 📞 Support Contacts

**Email:** hello@revlogic.co  
**Website:** [revlogic.co](https://revlogic.co)  
**GitHub:** [Issues](https://github.com/yourusername/revlogic-clay-sender/issues)  
**Docs:** [README](README.md) • [Setup Guide](SETUP-GUIDE.md) • [Troubleshooting](TROUBLESHOOTING.md)

---

## 🔗 Useful Links

- **Clay Webhook Docs:** https://docs.clay.com/en/articles/webhooks
- **Sales Navigator Guide:** https://business.linkedin.com/sales-solutions/sales-navigator/how-to-use-sales-navigator
- **Regex Tester:** https://regex101.com (test patterns before adding to extension)
- **Revlogic Templates:** https://revlogic.co/templates *(coming soon)*

---

## 📋 Daily Checklist

**Morning Prospecting Routine:**

- [ ] Open Sales Navigator
- [ ] Run filtered search
- [ ] Select 50-100 profiles
- [ ] Open extension
- [ ] Set correct domain (if needed)
- [ ] Click Refresh
- [ ] Verify preview looks good
- [ ] Click Send
- [ ] Go to Clay, start enrichments
- [ ] Repeat for next search

**Time saved:** 2-3 hours vs. manual CSV export/import

---

## 🎯 Most Common Use Cases

### Use Case 1: Building Target Account Lists
1. Search for specific companies in Sales Navigator
2. Export all relevant contacts
3. Set domain to company domain
4. Send to Clay
5. Enrich with email/phone
6. Sync to CRM

### Use Case 2: Territory Prospecting
1. Filter by location in Sales Navigator
2. Select all prospects in your territory
3. Export to Clay
4. Enrich and score
5. Prioritize outreach

### Use Case 3: Event Follow-Up
1. Search for event attendees on LinkedIn
2. Export to Clay
3. Personalize messaging with AI
4. Send follow-up emails

### Use Case 4: Competitive Intelligence
1. Search employees at competitor companies
2. Export to Clay
3. Track job changes
4. Identify buying signals

---

**Need more help?** Check the full [Setup Guide](SETUP-GUIDE.md) or [Troubleshooting](TROUBLESHOOTING.md) docs!

