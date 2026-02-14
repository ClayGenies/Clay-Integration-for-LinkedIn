# Troubleshooting Guide - Revlogic Clay Webhook Sender

Quick solutions to common issues. If you don't find your problem here, [open an issue on GitHub](https://github.com/yourusername/revlogic-clay-sender/issues).

---

## 🔴 Extension Not Working

### Extension icon is grayed out / disabled

**Symptoms:**
- Extension icon appears gray/faded
- Can't click to open side panel
- No response when clicking

**Causes & Fixes:**

**1. Wrong website**
- Extension only works on LinkedIn Sales Navigator
- Navigate to `linkedin.com/sales/search/people`
- Icon should become active

**2. Page not fully loaded**
- Wait for Sales Navigator to finish loading
- Refresh the page
- Try clicking again

**3. Extension not installed properly**
- Go to `chrome://extensions/`
- Make sure "Revlogic — Clay Webhook Sender" is enabled
- Try disabling and re-enabling it

---

### Side panel won't open

**Symptoms:**
- Click extension icon, nothing happens
- Side panel was working, now it's not

**Causes & Fixes:**

**1. Chrome side panel permissions issue**
- Right-click the extension icon
- Select "Open side panel"
- If that works, extension is fine (Chrome glitch)

**2. Extension error**
- Go to `chrome://extensions/`
- Find the Revlogic extension
- Click "Errors" button (if it appears)
- Screenshot the error and report it

**3. Cache issue**
- Close all LinkedIn tabs
- Restart Chrome
- Navigate to Sales Navigator fresh
- Try again

---

### "No active tab" error

**Symptoms:**
- Side panel shows "No active tab" message
- Can't refresh or send profiles

**Causes & Fixes:**

**1. Opened too early**
- Close the side panel
- Make sure Sales Navigator page is fully loaded
- Click extension icon again

**2. Multiple Sales Navigator tabs**
- Close extra tabs
- Keep only one Sales Navigator tab open
- Refresh that tab
- Try again

---

## 🔴 Configuration Issues

### "Missing Clay webhook" error

**Symptoms:**
- Click "Send" button
- Get error: "Missing Clay webhook - Open Settings to add webhook URL"

**Causes & Fixes:**

**1. Webhook not configured**
- Click "Settings" in the side panel
- Paste your Clay webhook URL
- Make sure it starts with `https://api.clay.com/webhook/`
- Click "Save changes"

**2. Invalid webhook URL**
- Check the URL doesn't have extra spaces
- Make sure you copied the FULL URL from Clay
- It should be 50+ characters long
- Try copying it again from Clay

**3. Settings not saved**
- After pasting webhook URL, you MUST click "Save changes"
- Look for confirmation message
- If no message appears, try saving again

---

### Settings won't save

**Symptoms:**
- Click "Save changes"
- No confirmation message appears
- Settings reset when you close the tab

**Causes & Fixes:**

**1. Browser storage permissions issue**
- Go to `chrome://extensions/`
- Find Revlogic extension
- Click "Details"
- Make sure "storage" permission is granted
- If not, you may need to reinstall

**2. Invalid values**
- Check webhook URL is valid HTTPS
- Check domain doesn't have http:// prefix (just use `example.com`)
- Check regex patterns are valid (test them first)

---

## 🔴 Selection & Preview Issues

### "No preview yet" after clicking Refresh

**Symptoms:**
- Click "Refresh" button
- Table shows "No preview yet. Click Refresh."
- No profiles appear

**Causes & Fixes:**

**1. No checkboxes selected in Sales Navigator**
- Go back to Sales Navigator search results
- Check the boxes next to profiles (left side)
- You should see checkmarks appear
- Click "Refresh" again

**2. Selected profiles disappeared**
- Sales Navigator sometimes clears selections
- Recheck the boxes
- Refresh quickly before they clear again

**3. Wrong Sales Navigator page**
- Extension only works on search result pages
- URL should contain `/sales/search/people`
- Navigate to a search page
- Run a search, select profiles, try again

---

### Profiles showing but missing data (name, company, etc.)

**Symptoms:**
- Profiles appear in preview table
- Some fields are blank or show "N/A"

**Causes & Fixes:**

**1. LinkedIn profile is incomplete**
- Some profiles don't show company publicly
- Some profiles have limited visibility
- This is normal - skip these profiles or:
  - Use Clay enrichments to find missing data
  - Manually research and add later

**2. Sales Navigator permissions issue**
- Make sure you're logged in to Sales Navigator
- Check your Sales Navigator subscription is active
- Some data requires premium Sales Navigator

**3. Extension parsing issue**
- If MANY profiles have missing data (50%+), this could be a bug
- Screenshot the Sales Navigator page
- Screenshot the extension preview
- Report as a GitHub issue

---

### Names have weird suffixes like "is reachable"

**Symptoms:**
- Last names show as "Doe is reachable"
- Full names have extra text

**Causes & Fixes:**

**This is a LinkedIn Sales Navigator quirk:**
- LinkedIn adds "is reachable" to names of premium contacts
- **Fix:** Use regex trimming

**Setup regex trimming:**
1. Go to Settings
2. Scroll to "Field trimming (advanced)"
3. Expand the section
4. Under "lastName trim regex" enter: `\s+is\s+reachable.*$`
5. Leave "Replace with" blank
6. Click "Save changes"
7. Refresh and send again

**Profiles will now have clean names!**

---

### Preview shows different domain than I want

**Symptoms:**
- Preview table shows `example.com` domain
- You want a different domain

**Causes & Fixes:**

**1. Default domain is set in Settings**
- This applies to ALL exports by default
- To change it: Settings → Default domain → Save

**2. Want different domain just for this export?**
- Look at the top of the side panel
- You'll see a pill showing the current domain
- **This is editable!**
- Click it, type new domain, press Enter
- Then click "Send"

---

## 🔴 Sending Issues

### "Send failed" error with status code

**Symptoms:**
- Click "Send"
- Get error like "Send failed - 400 Bad Request" or "500 Internal Server Error"

**Causes & Fixes by Status Code:**

**400 Bad Request**
- Your payload doesn't match what Clay expects
- **Fix 1:** Enable "Accept any payload" in Clay webhook settings
- **Fix 2:** Check Clay webhook logs for specific error
- **Fix 3:** Try sending just 1 profile in Single mode to debug

**401 Unauthorized / 403 Forbidden**
- Clay webhook URL is wrong or expired
- **Fix:** Regenerate webhook in Clay, update extension settings

**404 Not Found**
- Webhook URL is incorrect
- **Fix:** Copy webhook URL from Clay again, paste in Settings

**429 Too Many Requests**
- You're hitting Clay's rate limit
- **Fix 1:** Switch to Single mode (slower but safer)
- **Fix 2:** Add delays between sends (220ms default)
- **Fix 3:** Wait a few minutes, try again

**500 Internal Server Error**
- Clay's servers are having issues
- **Fix:** Wait a few minutes, try again
- Check [Clay's status page](https://status.clay.com)

**502/503/504 Gateway/Service errors**
- Clay is temporarily down or slow
- **Fix:** Wait and retry
- Contact Clay support if persists

---

### Send succeeds but profiles don't appear in Clay

**Symptoms:**
- Extension shows "Done - X sent" with green checkmark
- But profiles don't show up in your Clay table

**Causes & Fixes:**

**1. Wrong Clay table**
- You might be looking at a different table
- Check the webhook URL in extension Settings
- Go to that specific table in Clay

**2. Webhook row source disabled**
- In Clay, check your webhook row source is enabled (toggle ON)
- Webhook might have been accidentally disabled

**3. Column mapping issue**
- Clay created the rows but you can't see them
- Check Clay's webhook logs:
  - Click the webhook row source
  - Click "View logs"
  - See if records were received
- If records show in logs but not in table:
  - Your column mapping might be wrong
  - Enable "Accept any payload"
  - Or rename columns to match payload

**4. Clay table filtered**
- You might have a filter hiding new rows
- Click "Clear filters" in Clay
- Check "All rows" view

---

### Sending stuck at "Sending... 1/X"

**Symptoms:**
- Send starts
- Progress shows "Sending... 1/50"
- Gets stuck there, never finishes

**Causes & Fixes:**

**1. Slow network/Clay servers**
- Just wait - each profile takes ~220ms
- 50 profiles = ~11 seconds minimum
- If stuck for >30 seconds, there's a problem

**2. Rate limiting**
- Clay might be throttling your requests
- Refresh the page
- Switch to Batch mode (faster) or
- Increase delay between sends (edit code)

**3. Invalid webhook response**
- One profile caused an error and extension stopped
- Check which profile number it stopped at
- Check Clay webhook logs for errors
- That specific profile might have bad data

**4. Browser/Extension crash**
- Close all Chrome tabs
- Restart Chrome
- Try sending again with fewer profiles first

---

### Batch mode sends but Clay shows 1 row (not split)

**Symptoms:**
- Sent 50 profiles in Batch mode
- Clay table shows only 1 row
- Row contains an array of all 50 profiles

**Causes & Fixes:**

**This is expected behavior in Batch mode!**

Batch mode sends all profiles in one webhook as an array.

To split them into individual rows in Clay:

1. In your Clay table, select the webhook row
2. Click "Add enrichment"
3. Search for "Split array"
4. Configure split enrichment:
   - Array field: `records`
   - Output: New rows
5. Run the enrichment
6. 50 rows will be created

**OR:** Use Single mode instead (recommended for most users)

---

## 🔴 Performance Issues

### Extension is slow to load profiles

**Symptoms:**
- Click "Refresh"
- Takes 10+ seconds to show preview
- Laggy/unresponsive

**Causes & Fixes:**

**1. Too many profiles selected**
- Extension shows first 200 in preview (but sends all)
- If you selected 500+, preview might be slow
- Send will still work, just preview takes time

**2. Sales Navigator page is slow**
- Extension has to read from the DOM
- If Sales Nav is slow, extension is slow
- Refresh the Sales Navigator page
- Try with fewer browser tabs open

**3. Regex trimming enabled**
- Complex regex patterns slow down preview
- Disable trimming temporarily
- Or simplify your regex patterns

---

### Sending is too slow

**Symptoms:**
- Sending 100 profiles takes 5+ minutes
- Want it faster

**Causes & Fixes:**

**1. Use Batch mode (advanced)**
- Settings → Send mode → Batch
- Sends everything in 1-2 seconds
- **Warning:** Harder to debug if something fails

**2. Reduce delay between sends**
- In Single mode, there's a 220ms delay between profiles
- This is intentional (prevents rate limiting)
- You can edit `sidepanel.js` line 275 to reduce:
  ```javascript
  await new Promise((res) => setTimeout(res, 100)); // was 220
  ```
- **Risk:** Clay might rate-limit you

**3. Send in smaller batches**
- Instead of 500 at once, do 5 batches of 100
- Faster overall (psychological)
- Easier to track progress

---

## 🔴 Data Quality Issues

### Duplicate profiles in Clay

**Symptoms:**
- Sent same profile multiple times
- Clay table has duplicates

**Causes & Fixes:**

**1. You selected same profile twice**
- In Sales Navigator, unchecking then rechecking adds again
- Extension doesn't dedupe automatically
- **Fix:** Use Clay's "Dedupe by column" feature:
  - Settings → Deduplication
  - Dedupe by: LinkedIn URL
  - Action: Keep first row

**2. Clay table doesn't have LinkedIn URL unique**
- Add "LinkedIn URL" column
- Set it as unique
- Clay will auto-reject duplicates

---

### Wrong company domain assigned

**Symptoms:**
- All profiles have same domain
- But they work at different companies

**Causes & Fixes:**

**1. Default domain is overriding everything**
- Default domain in Settings applies to ALL exports
- To fix:
  - Settings → Default domain → Leave blank
  - OR use editable pill in sidebar for each export

**2. Want automatic domain extraction?**
- This extension doesn't auto-extract company domains
- It assigns the domain YOU specify
- Use Clay enrichments after export:
  - "Find company from LinkedIn"
  - "Get company domain"

---

### LinkedIn URLs are missing or wrong

**Symptoms:**
- Some profiles don't have LinkedIn URLs
- URLs point to wrong profiles

**Causes & Fixes:**

**1. LinkedIn profile structure changed**
- Extension parses Sales Navigator DOM
- If LinkedIn changed their HTML, parsing might break
- Report as GitHub issue if this affects >10% of profiles

**2. Private profiles**
- Some profiles don't show full URL in Sales Nav
- Extension can't extract what's not visible
- **Fix:** Skip these profiles or manually add URLs

**3. Wrong tab/page**
- Make sure you're on Sales Navigator search results
- URL should be `/sales/search/people`
- Not company pages, saved searches, etc.

---

## 🔴 Advanced Issues

### Regex patterns not working

**Symptoms:**
- Configured regex trimming
- Profiles still have unwanted text

**Causes & Fixes:**

**1. Regex syntax error**
- Test your regex first: [regex101.com](https://regex101.com)
- Make sure you escaped special characters
- Example: `\s` not just `s`

**2. Wrong field**
- Make sure you're applying regex to the right field
- "is reachable" → apply to `lastName`
- Company suffixes → apply to `company`

**3. Refresh after changing regex**
- Regex only applies to NEW exports
- After changing settings:
  - Uncheck all profiles in Sales Nav
  - Recheck them
  - Refresh in extension
  - Send again

---

### Chrome says "Extensions cannot be added from this website"

**Symptoms:**
- Trying to install from GitHub
- Chrome blocks installation

**Causes & Fixes:**

**1. Can't install directly from GitHub**
- GitHub isn't a recognized extension source
- You must use Developer Mode

**2. Use Developer Mode installation:**
- Download ZIP from GitHub
- Extract to folder
- Chrome → `chrome://extensions/`
- Enable Developer Mode
- "Load unpacked"
- Select the folder

**3. Wait for Chrome Web Store version (coming soon)**

---

### Extension disappeared after Chrome update

**Symptoms:**
- Extension was working
- Chrome updated
- Extension is gone

**Causes & Fixes:**

**1. Chrome disabled developer mode extensions**
- Chrome sometimes does this after updates
- Go to `chrome://extensions/`
- Re-enable Developer Mode
- Extension should reappear
- Click "Reload" on the extension

**2. Extension needs update for new Chrome version**
- Check for updated version on GitHub
- Download latest release
- Replace old folder with new folder
- Reload extension

---

## 🔴 Can't Find Your Issue?

### Before opening a GitHub issue:

1. **Check Chrome console for errors:**
   - F12 → Console tab
   - Try reproducing the issue
   - Screenshot any red errors
   
2. **Check extension error logs:**
   - `chrome://extensions/`
   - Find Revlogic extension
   - Click "Errors" (if button appears)
   - Screenshot errors

3. **Gather this info:**
   - Chrome version (chrome://version)
   - Extension version (check manifest.json or chrome://extensions)
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots

4. **Open issue:** [GitHub Issues](https://github.com/yourusername/revlogic-clay-sender/issues)

---

## 💬 Get Help

Still stuck? We're here to help:

- 📧 Email: hello@revlogic.co
- 💼 Book a call: [calendly.com/revlogic](https://calendly.com/revlogic)
- 🎥 Watch tutorials: [YouTube](https://youtube.com/@revlogic)
- 🐛 Report bugs: [GitHub Issues](https://github.com/yourusername/revlogic-clay-sender/issues)

