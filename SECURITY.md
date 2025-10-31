# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 3.0.x   | :white_check_mark: |
| 2.0.x   | :x:                |
| < 2.0   | :x:                |

## Reporting a Vulnerability

The security of YouTube Comment Manager is important to us. If you discover a security vulnerability, please follow these steps:

### How to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security issues via email:

📧 **Email:** haseebkaloya@gmail.com

**Subject Line:** `[SECURITY] YouTube Comment Manager - Brief Description`

### What to Include

Please include the following information:

1. **Description** - Clear description of the vulnerability
2. **Impact** - What could an attacker do with this vulnerability?
3. **Steps to Reproduce** - Detailed steps to reproduce the issue
4. **Affected Versions** - Which versions are affected?
5. **Proof of Concept** - If possible, include code or screenshots
6. **Suggested Fix** - If you have ideas on how to fix it

### Example Report

```
Subject: [SECURITY] YouTube Comment Manager - XSS in Comment Input

Description:
The comment input field does not properly sanitize user input,
allowing potential XSS attacks.

Impact:
An attacker could inject malicious scripts that execute when
comments are displayed.

Steps to Reproduce:
1. Open extension popup
2. Enter: <script>alert('XSS')</script>
3. View logs

Affected Versions: 3.0.0 and below

Proof of Concept:
[Screenshot or code snippet]

Suggested Fix:
Implement proper HTML escaping for all user inputs before display.
```

## Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 5 business days
- **Fix Timeline:** Depends on severity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Next regular release

## Security Update Process

1. **Acknowledgment** - We acknowledge receipt of your report
2. **Verification** - We verify and assess the vulnerability
3. **Fix Development** - We develop and test a fix
4. **Release** - We release a security update
5. **Disclosure** - We publicly disclose the issue (with credit to reporter if desired)

## Security Best Practices for Users

To maintain security while using this extension:

### Do's ✅
- Keep the extension updated to the latest version
- Use official installation sources only
- Review permissions before installing
- Report suspicious behavior immediately
- Use strong, unique YouTube account passwords
- Enable two-factor authentication on your YouTube account

### Don'ts ❌
- Don't share your YouTube login credentials
- Don't use the extension on public/shared computers
- Don't ignore browser security warnings
- Don't modify extension files unless you know what you're doing
- Don't use cracked or modified versions

## Known Security Considerations

### Permissions
The extension requires these permissions:
- `activeTab` - To interact with YouTube pages
- `storage` - To save settings locally
- `scripting` - To inject comment functionality
- `youtube.com` - Access to YouTube domain only

**Why these are safe:**
- No network permissions beyond YouTube
- No access to other websites
- Local storage only (no remote servers)
- Minimal permission set

### Data Privacy
- All data stored locally on your device
- No telemetry or analytics
- No external API calls
- No user tracking

### Code Security
- Open source and auditable
- No obfuscation
- Regular security reviews
- Community oversight

## Vulnerability Disclosure Policy

### Coordinated Disclosure

We follow responsible disclosure practices:

1. **Private Disclosure First** - Report to us privately
2. **Coordinated Timeline** - We work together on a fix
3. **Public Disclosure** - After fix is released and users have time to update
4. **Credit** - Security researchers are credited (if desired)

### Public Disclosure Timeline

- **90 days** after initial report OR
- **When fix is released and deployed**, whichever comes first

### Hall of Fame

We recognize security researchers who help improve our security:

*No vulnerabilities reported yet. Be the first!*

## Security Features

### Built-in Security

**Input Validation:**
- URL validation before processing
- Comment length limits
- Delay bounds enforcement
- Type checking on all inputs

**Content Security:**
- No eval() or similar dangerous functions
- No inline scripts in HTML
- CSP-compliant code
- Sanitized user inputs

**Storage Security:**
- Local storage only (no cloud sync)
- No sensitive data stored
- Settings can be cleared anytime
- No persistent authentication

## Contact

For security concerns:
- 📧 **Email:** haseebkaloya@gmail.com
- 🔒 **PGP Key:** Available upon request

For general issues:
- 🐛 **GitHub Issues:** [Create an issue](https://github.com/HaseebKaloya/youtube-comment-manager/issues)

## Legal

By reporting a security vulnerability, you agree to:
- Give us reasonable time to address the issue
- Not publicly disclose the issue until we've released a fix
- Not exploit the vulnerability beyond what's necessary to demonstrate it

We commit to:
- Respond promptly to your report
- Keep you informed of our progress
- Credit you for the discovery (if you wish)
- Not pursue legal action against good-faith security researchers

---

**Thank you for helping keep YouTube Comment Manager secure!**

*Last updated: October 30, 2025*
