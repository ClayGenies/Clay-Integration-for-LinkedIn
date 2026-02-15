# Clay Genies | Clay Webhook Sender

> **Open Source Chrome Extension** to send LinkedIn profiles to Clay via webhooks

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Version](https://img.shields.io/badge/version-3.0-blue.svg)
![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red.svg)

**Free & Open Source Forever** | [⭐ Star on GitHub](https://github.com/ClayGenies/Clay-Integration-for-LinkedIn/)

---

## ⚠️ Important Legal Disclaimer

**This is an independent, open source tool created by ClayGenies.com.**

### We are NOT affiliated with:
- **Clay™** (trademark of Clay.com)
- **LinkedIn®** (registered trademark of Microsoft Corporation)
- **Microsoft®**

### License & Liability
This software is provided **"AS IS"** under the **MIT License**. 

**You are responsible for:**
- ✅ Complying with LinkedIn's Terms of Service
- ✅ Complying with Clay's Terms of Service  
- ✅ Using this tool ethically and legally
- ✅ Any consequences of your use

**USE AT YOUR OWN RISK.** The authors and contributors assume no liability for your use of this tool.

See [LICENSE](LICENSE) file for full terms.

---

## 🚀 What It Does

Sends LinkedIn profile data directly to your Clay table via webhooks.

**Before:** Export CSV → Clean data → Upload to Clay → Wait  
**After:** Click Send → Done ✅

Works on:
- ✅ Regular LinkedIn profiles (`/in/...`)
- ✅ Sales Navigator leads (`/sales/lead/...`)
- ✅ Recruiter profiles (`/talent/profile/...`)
- ✅ Sales Navigator search results (bulk)
- ✅ Recruiter search results (bulk)

---

## 📦 Installation

### Option 1: Load Unpacked (Development)

1. Download/clone this repo
2. Open Chrome → `chrome://extensions/`
3. Enable **"Developer mode"** (top right)
4. Click **"Load unpacked"**
5. Select the extension folder
6. ✅ Installed!

### Option 2: Chrome Web Store (Coming Soon)

Extension will be published to Chrome Web Store soon.

---

## ⚙️ Setup

1. **Get Clay Webhook URL:**
   - Open your Clay table
   - Go to table settings → Webhooks
   - Copy webhook URL

2. **Configure Extension:**
   - Click extension icon → Settings
   - Paste webhook URL
   - (Optional) Add your email and HubSpot User ID
   - Save settings

3. **You're ready!**

---

## 📖 How to Use

### Single Profile Mode

1. Navigate to any LinkedIn profile, Sales Navigator lead, or Recruiter profile
2. Click extension icon (sidebar opens)
3. Click **"Send"**
4. Profile appears in Clay table!

### Bulk Mode (Sales Navigator / Recruiter)

1. Go to Sales Navigator search results
2. **⚠️ IMPORTANT: Scroll to the bottom** of the page to load all results
3. Tick checkboxes next to profiles you want
4. Click extension icon → **"Refresh"** (preview appears)
5. Click **"Send"**
6. All profiles sent to Clay!

**Pro tip:** The extension auto-refreshes when you navigate to prevent sending stale data.

---

## 📊 Webhook Payload

### Single Mode (default)
```json
{
  "fullName": "John Doe",
  "firstName": "John",
  "lastName": "Doe",
  "company": "Acme Corp",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "addedBy": "you@company.com",
  "hsUserId": "123456",
  "sourceUrl": "https://linkedin.com/sales/search/...",
  "sentAt": "2026-02-14T12:34:56.789Z"
}
```

### Batch Mode
```json
{
  "records": [
    { "fullName": "John Doe", ... },
    { "fullName": "Jane Smith", ... }
  ],
  "sentAt": "2026-02-14T12:34:56.789Z"
}
```

---

## ✨ Features

- ✅ **Auto-refresh** - Updates preview when you change pages
- ✅ **Single & bulk modes** - Send one profile or hundreds
- ✅ **Smart extraction** - Works on all LinkedIn surfaces
- ✅ **Trim rules** - Clean unwanted text with regex
- ✅ **Metadata** - Add your email, CRM user ID, etc.
- ✅ **Open source** - MIT License, modify as needed
- ✅ **Privacy-first** - Data goes directly to YOUR webhook

---

## 🛠️ Advanced: Field Trimming

Remove unwanted text from fields using regex patterns.

**Example:** Remove "is reachable" suffix from names
```
Pattern: \s+is reachable.*$
Replace: (leave blank)
```

Go to Settings → Field Trimming to configure.

---

## 🤝 Contributing

We welcome contributions!

**Ways to contribute:**
- 🐛 Report bugs via [Issues](https://github.com/ClayGenies/Clay-Integration-for-LinkedIn/issues)
- 💡 Suggest features
- 🔧 Submit Pull Requests
- ⭐ Star the repo!

**Before contributing:**
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit PR with description

---

## 📜 License

**MIT License**

Copyright (c) 2026 ClayGenies.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## 🏢 About Revlogic

We build revenue automation with Clay and AI.

**Services:**
- Custom Clay workflows
- Chrome extensions
- AI integrations
- RevOps consulting

**Contact:**
- 🌐 [ClayGenies.com](https://ClayGenies.com)
- 📧 hello@claygenies.com

---

## 📞 Support

**For bugs or feature requests:**
- Open an [Issue](https://github.com/ClayGenies/Clay-Integration-for-LinkedIn/issues)

**For general questions:**
- Email: hello@claygenies.com

**For consulting/custom work:**
- Visit [ClayGenies.com](https://claygenies.com)

---

## ⚖️ Trademarks

- Clay™ is a trademark of Clay.com
- LinkedIn® is a registered trademark of Microsoft Corporation
- All trademarks are property of their respective owners

This tool is an independent project and is not endorsed by or affiliated with any of these companies.

---

**Version:** 3.0  
**Last Updated:** February 2026  
**Status:** Active Development

**Made with ❤️ by the open source community**

[⭐ Star on GitHub](https://github.com/ClayGenies/Clay-Integration-for-LinkedIn) | [📄 License](LICENSE) | [🏢 ClayGenies.com](https://rclaygenies.com)
