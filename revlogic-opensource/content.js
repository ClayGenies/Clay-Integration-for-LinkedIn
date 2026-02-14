/**
 * Revlogic Clay Webhook Sender - Content Script
 * Open Source Chrome Extension
 * Copyright (c) 2026 Revlogic.co
 * Licensed under MIT License
 * GitHub: https://github.com/revlogic/clay-webhook-sender
 */

// Content script - extracts profile data from LinkedIn pages
// Works on: Regular profiles, Sales Navigator, Recruiter

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_SELECTED_PEOPLE") {
    // For Sales Navigator lead pages, wait a bit for dynamic content to load
    const isSalesNavLead = window.location.href.includes('/sales/lead/');
    
    if (isSalesNavLead) {
      // Wait for the page to be fully loaded
      setTimeout(() => {
        const result = extractPeople();
        sendResponse(result);
      }, 500);
      return true; // Keep message channel open
    } else {
      const result = extractPeople();
      sendResponse(result);
    }
  }
  return true;
});

function extractPeople() {
  const url = window.location.href.toLowerCase();
  
  // SINGLE PROFILE MODE - check first (higher priority)
  if (isSingleProfilePage(url)) {
    return extractSingleProfile();
  }
  
  // BULK MODE - Sales Navigator / Recruiter search results
  return extractBulkPeople();
}

function isSingleProfilePage(url) {
  // Regular LinkedIn profile
  if (url.includes('/in/') && !url.includes('/search')) return true;
  
  // Sales Navigator lead profile
  if (url.includes('/sales/lead/')) return true;
  
  // Recruiter talent profile  
  if (url.includes('/talent/profile/')) return true;
  
  return false;
}

function extractSingleProfile() {
  const cleanUrl = window.location.href.split('?')[0];
  
  // Try to extract name from page
  let fullName = "";
  
  // Sales Navigator lead pages have specific structure
  const isSalesNavLead = window.location.href.includes('/sales/lead/');
  
  if (isSalesNavLead) {
    // Sales Navigator lead page selectors (in priority order)
    const salesNavSelectors = [
      // Main name heading
      '.profile-topcard-person-entity__name',
      'h1.artdeco-entity-lockup__title',
      '[data-control-name="view_lead_panel_via_search_lead_name"]',
      // Alternative selectors
      '.profile-topcard__title',
      'h1[class*="profile"]',
      // Fallback to any h1 in the topcard area
      '.profile-topcard h1',
      'div[class*="profile-topcard"] h1'
    ];
    
    for (const selector of salesNavSelectors) {
      const el = document.querySelector(selector);
      if (el) {
        const text = (el.innerText || el.textContent || "").trim();
        // Make sure we got actual text, not generic labels
        if (text && 
            text.length > 2 && 
            !text.toLowerCase().includes('sales navigator') &&
            !text.toLowerCase().includes('lead page') &&
            !text.toLowerCase().includes('profile')) {
          fullName = text;
          break;
        }
      }
    }
    
    // If still no name, try getting it from the page title
    if (!fullName) {
      const title = document.title;
      // Sales Nav titles are like "John Doe | Sales Navigator"
      if (title && title.includes('|')) {
        const namePart = title.split('|')[0].trim();
        if (namePart && namePart.length > 2) {
          fullName = namePart;
        }
      }
    }
  } else {
    // Regular LinkedIn profile selectors
    const nameSelectors = [
      'h1.text-heading-xlarge',
      'h1[class*="pv-top-card"]',
      'h1',
      '[data-test-profile-card__name]',
      '.pv-text-details__left-panel h1',
      // Recruiter
      '.profile-topcard__title'
    ];
    
    for (const selector of nameSelectors) {
      const el = document.querySelector(selector);
      if (el) {
        fullName = (el.innerText || el.textContent || "").trim();
        if (fullName) break;
      }
    }
  }
  
  // Clean the name
  if (fullName) {
    // Remove common suffixes and artifacts
    fullName = fullName.split('\n')[0].trim();
    fullName = fullName.replace(/\s+·\s+.*$/i, '').trim();
    fullName = fullName.replace(/\s+is reachable.*$/i, '').trim();
    fullName = fullName.replace(/\s+\(.*?\)\s*$/i, '').trim();
    fullName = fullName.replace(/\s+•\s+.*$/i, '').trim();
  }
  
  // Extract first/last name if possible
  const nameParts = (fullName || "").split(' ').filter(Boolean);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(' ') || "";
  
  // Try to extract company
  let company = "";
  const companySelectors = [
    // Sales Navigator
    '[data-control-name="view_lead_panel_via_search_lead_position"]',
    '.profile-topcard__summary-position-title',
    '.profile-topcard-person-entity__position',
    // Regular LinkedIn
    '[class*="pv-top-card"] [class*="pv-text-details__right-panel"] div:first-child',
    '.pv-text-details__right-panel div',
    'div[data-test-profile-card__subtitle]',
    // Recruiter
    '.profile-topcard__summary-position'
  ];
  
  for (const selector of companySelectors) {
    const el = document.querySelector(selector);
    if (el) {
      company = (el.innerText || el.textContent || "").trim();
      company = company.split('\n')[0].trim();
      if (company && 
          !company.toLowerCase().includes('connection') &&
          !company.toLowerCase().includes('message') &&
          company.length > 2) {
        break;
      }
    }
  }
  
  return {
    ok: true,
    people: [{
      fullName: fullName || "Unknown",
      firstName: firstName,
      lastName: lastName,
      company: company,
      linkedinUrl: cleanUrl,
      sourceUrl: window.location.href
    }],
    sourceUrl: window.location.href
  };
}

function extractBulkPeople() {
  const people = [];
  
  // Find all checked checkboxes
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  
  checkboxes.forEach(checkbox => {
    const row = findRowContainer(checkbox);
    if (!row) return;
    
    const person = extractPersonFromRow(row);
    if (person && person.linkedinUrl) {
      people.push(person);
    }
  });
  
  if (people.length === 0) {
    return {
      ok: false,
      error: "No profiles selected. Check boxes next to profiles first.",
      people: []
    };
  }
  
  return {
    ok: true,
    people: people,
    sourceUrl: window.location.href
  };
}

function absUrl(href) {
  try { return new URL(href, location.href).toString(); } catch { return href || ""; }
}

function txt(el) {
  return (el?.innerText || el?.textContent || "").trim();
}

function cleanName(s) {
  let t = (s || "").trim();
  t = t.replace(/\s+is\s+reachable.*$/i, "").trim();
  t = t.replace(/\s+is\s+open\s+to.*$/i, "").trim();
  t = t.replace(/\s+\(.*?\)\s*$/i, "").trim();
  t = t.replace(/\s+•\s+.*$/i, "").trim();
  return t;
}

function findRowContainer(checkbox) {
  return checkbox.closest("li") ||
         checkbox.closest('[role="listitem"]') ||
         checkbox.closest("tr") ||
         checkbox.closest("div");
}

function extractPersonFromRow(row) {
  const link =
    row.querySelector('a[href*="/in/"]') ||
    row.querySelector('a[href*="/sales/people/"]') ||
    row.querySelector('a[href*="/sales/lead/"]') ||
    row.querySelector('a[href*="linkedin.com/in/"]');

  const linkedinUrl = link ? absUrl(link.getAttribute("href")) : "";

  let fullName = (link ? txt(link) : "") ||
                 (link ? (link.getAttribute("aria-label") || "").trim() : "");

  if (!fullName) {
    const nameEl =
      row.querySelector('[data-anonymize="person-name"]') ||
      row.querySelector('span[dir="auto"]') ||
      row.querySelector("strong") ||
      row.querySelector("span");
    fullName = txt(nameEl);
  }

  fullName = cleanName((fullName || "").split("\n")[0].trim());

  let firstName = "";
  let lastName = "";
  
  if (fullName) {
    const parts = fullName.split(/\s+/);
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ") || "";
  }

  let company = "";
  const companyEl =
    row.querySelector('[data-anonymize="company-name"]') ||
    row.querySelector('span[class*="entity-result__secondary-subtitle"]') ||
    row.querySelector('[class*="t-14"]');
  company = txt(companyEl);
  
  return {
    fullName,
    firstName,
    lastName,
    company,
    linkedinUrl,
    sourceUrl: window.location.href
  };
}
