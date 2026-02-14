# Clay Genies | Clay Webhook Sender

> Send LinkedIn Sales Navigator profiles directly to Clay via webhooks. One click. Zero copy-paste.

![Version](https://img.shields.io/badge/version-2.7-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Chrome-yellow.svg)

Built by [Clay Genies](https://claygenies.com) — Revenue automation experts specializing in Clay and AI-powered workflows.

---

## 🎯 Why This Extension Exists

Manual prospecting is killing your productivity.

Sales Navigator checkboxes → Copy profile → Paste into spreadsheet → Upload to Clay → Wait for enrichment.

**That workflow sucks.**

This extension eliminates all of it:

**Old way:** 10+ hours/week of manual data entry  
**New way:** 10 minutes of automated webhook sending

Select profiles in Sales Navigator → Click Send → Done. Your Clay table fills automatically.

---

## ✨ Features

- ✅ **Bulk export** - Send hundreds of Sales Navigator profiles at once
- ✅ **Smart extraction** - Automatically captures name, company, LinkedIn URL
- ✅ **Custom fields** - Add your email, HubSpot, Salesforce or Bullhorn User ID, or any metadata
- ✅ **Regex cleaning** - Removes "is reachable" and other junk from names
- ✅ **Single or batch mode** - Control how webhooks fire
- ✅ **Privacy-first** - All data goes directly to YOUR Clay webhook (nobody else ever sees it)

---

## 🚀 Quick Start

### Prerequisites
- Clay account with webhook-enabled table — Need a template to get started? Head over to claygenies.com and talk to our team! We'll also get you hooked up with some additional free Clay credits if you're a new user. 🚀
- LinkedIn Sales Navigator account
- Chrome browser
- 5 minutes

### Installation

**Option 1: From Source (Developer Mode)**

1. Download this repository
2. Open Chrome → `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the extension folder
6. Pin the extension to your toolbar

**Option 2: Chrome Web Store** *(coming soon)*

### Setup (First Time)

1. **Create a Clay webhook table:**
   - Open Clay → Create new table
   - Add row source → Select "Webhook"
   - Copy the webhook URL (looks like `https://api.clay.com/webhook/...`)

2. **Configure the extension:**
   - Click the extension icon in Chrome
   - Click "Settings"
   - Paste your Clay webhook URL
   - (Optional) Add default domain (e.g., `example.com`)
   - (Optional) Add your email in "Added By" field
   - Click "Save changes"

3. **You're ready!**

---

## 📖 How to Use

### Basic Workflow

1. **Go to LinkedIn Sales Navigator**
   - Navigate to `linkedin.com/sales/search/people`
   - Run your search filters

2. **Select profiles**
   - Check the boxes next to profiles you want to send to Clay
   - Select as many as you need (supports bulk)

3. **Open the extension**
   - Click the Clay Genies extension icon
   - You'll see a side panel open

4. **Preview your selection**
   - Click "Refresh" to preview selected profiles
   - Check the table shows correct names/companies

5. **Send to Clay**
   - Click "Send"
   - Watch the status indicator as profiles are sent
   - Done! Check your Clay table

### Advanced Tips

**Custom domain for each export:**
- In the side panel, the current domain is editable
- Change it before clicking Send
- Useful for company-specific lists

**Batch vs Single mode:**
- **Single** (recommended): Sends one webhook per profile. Safer for rate limits.
- **Batch**: Sends all profiles in one webhook as an array. Faster but riskier.
- Change in Settings

**Field cleaning:**
- LinkedIn sometimes adds "is reachable" to last names
- Use regex patterns in Settings to auto-remove this
- Example pattern: `\s+is\s+reachable.*$`

---

## 🔧 Configuration Reference

### Required Settings

| Field | Description | Example |
|-------|-------------|---------|
| Clay Webhook URL | Your Clay table's webhook endpoint | `https://api.clay.com/webhook/abc123...` |

### Optional Settings

| Field | Description | Example |
|-------|-------------|---------|
| Default Domain | Auto-applied to all records | `example.com` |
| Added By | Your email (for tracking) | `you@company.com` |
| HS User ID | HubSpot user ID | `31712004` |
| Send Mode | Single or batch | `single` |

### Field Trimming (Advanced)

Use regex patterns to clean extracted data:

| Field | Pattern | Replacement | Result |
|-------|---------|-------------|--------|
| lastName | `\s+is\s+reachable.*$` | *(empty)* | Removes "is reachable" suffix |
| company | `\s+\|.*$` | *(empty)* | Removes everything after pipe |

---

## 📊 Webhook Payload Format

### Single Mode (default)

```json
{
  "fullName": "Jane Doe",
  "firstName": "Jane",
  "lastName": "Doe",
  "domain": "acme.com",
  "addedBy": "you@company.com",
  "hsUserId": "31712004",
  "company": "Acme Corp",
  "linkedinUrl": "https://www.linkedin.com/in/janedoe",
  "sourceUrl": "https://www.linkedin.com/sales/search/people?..."
}
```

### Batch Mode

```json
{
  "records": [
    {
      "fullName": "Jane Doe",
      "firstName": "Jane",
      "lastName": "Doe",
      ...
    },
    {
      "fullName": "John Smith",
      "firstName": "John",
      "lastName": "Smith",
      ...
    }
  ],
  "domain": "acme.com",
  "sentAt": "2026-02-13T12:34:56.789Z"
}
```

---

## 🎥 Video Tutorial

**Watch the 3-minute setup guide:** *(coming soon)*

---

## 🛠️ Clay Table Setup

Your Clay table should have these columns to receive the webhook data:

| Column Name | Type | Maps From |
|-------------|------|-----------|
| Full Name | Text | `fullName` |
| First Name | Text | `firstName` |
| Last Name | Text | `lastName` |
| Company | Text | `company` |
| Domain | Text | `domain` |
| LinkedIn URL | URL | `linkedinUrl` |
| Added By | Email | `addedBy` |
| HS User ID | Number | `hsUserId` |
| Source URL | URL | `sourceUrl` |

**Pro tip:** Enable "Accept any payload" in Clay webhook settings for flexibility.

---

## ❓ Troubleshooting

### Extension icon is grayed out

**Cause:** You're on a page where the extension can't run (e.g., not Sales Navigator)

**Fix:** Navigate to `linkedin.com/sales/search/people`

---

### "Missing Clay webhook" error

**Cause:** Webhook URL not configured or invalid

**Fix:** 
1. Click extension → Settings
2. Paste your Clay webhook URL
3. Make sure it starts with `https://`
4. Click "Save changes"

---

### No profiles showing after clicking Refresh

**Cause:** No checkboxes selected in Sales Navigator

**Fix:**
1. Go back to Sales Navigator search results
2. Check the boxes next to profiles you want
3. Click Refresh again

---

### Profiles sent but not appearing in Clay

**Cause:** Column names in Clay don't match webhook payload

**Fix:**
1. Check your Clay table columns match the payload format above
2. Enable "Accept any payload" in Clay webhook settings
3. Send a test profile
4. Check Clay's webhook logs for errors

---

### "Send failed" error

**Cause:** Clay webhook is rejecting the payload

**Fix:**
1. Check Clay table webhook is enabled
2. Verify webhook URL is correct
3. Try sending a single profile first (change to Single mode)
4. Check Clay webhook logs for specific error

---

### Names have "is reachable" suffix

**Cause:** LinkedIn Sales Navigator adds this to some profiles

**Fix:**
1. Go to Settings → Field trimming
2. Under "lastName trim regex" add: `\s+is\s+reachable.*$`
3. Leave "Replace with" blank
4. Save changes
5. Refresh and send again

---

## 🔒 Privacy & Security

- **Local only:** All settings stored in your browser (not on any server)
- **Direct connection:** Extension sends data directly to YOUR Clay webhook
- **No tracking:** We don't collect, store, or see your data
- **Open source:** All code is visible in this repository

**What we DON'T have access to:**
- Your Clay data
- Your LinkedIn account
- Your Sales Navigator searches
- Any profile information you export

---

## 📄 License

MIT License - Free to use, modify, and distribute.

See [LICENSE](LICENSE) for full details.

---

## 👨‍💻 About Clay Genies

We build revenue machines with Clay and AI.

**What we do:**
- Custom Clay automations for B2B sales teams
- AI-powered enrichment and personalization
- Chrome Extensions and integration tools
- Revenue operations consulting

**Our work:**
- [Clay Templates Library](https://claygenies.com/templates) *(coming soon)*
- [YouTube Tutorials](https://youtube.com/@claygenies) *(coming soon)*
- [LinkedIn](https://linkedin.com/company/claygenies)

---

## 🚀 Need Custom Development?

We build custom Clay automations, Chrome Extensions, and AI workflows for sales teams.

**Services:**
- **Starter Automation** - $2,500 (1 custom workflow)
- **Revenue Stack** - $7,500 (Full automation system)
- **Custom Extension** - $5,000+ (Your specific workflow)
- **Monthly Retainer** - $3K-5K (Ongoing optimization)

**Let's talk:**
- 📧 Email: hello@claygenies.com
- 💼 Website: [claygenies.com](https://claygenies.com)
- 📅 Book a call: [calendly.com/claygenies/](https://calendly.com/claygenies/intro)

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 🐛 Bug Reports

Found a bug? [Open an issue](https://github.com/yourusername/claygenies-Clay-Integration-for-LinkedIn/issues)

Include:
- Chrome version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if relevant)

---

## ⭐ Show Your Support

If this saved you time:

1. ⭐ Star this repository
2. 🐦 [Tweet about it](https://twitter.com/intent/tweet?text=Just%20found%20this%20awesome%20Clay%20webhook%20extension!&url=REPO_URL)
3. 📝 Share on LinkedIn
4. 🔗 Tell your sales team

**Every star helps more people discover this tool. Thank you!** 🙏

---

## 📚 Related Resources

- [Clay Documentation](https://docs.clay.com)
- [Sales Navigator Guide](https://business.linkedin.com/sales-solutions/sales-navigator/how-to-use-sales-navigator)
- [Webhook Best Practices](https://docs.clay.com/en/articles/webhooks)

---

**Built with ❤️ by [Clay Genies](https://claygenies.com) | Last updated: February 14th 2026**

