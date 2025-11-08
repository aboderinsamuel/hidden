# Release Strategy

## 🚀 Versioning

closedNote follows [Semantic Versioning](https://semver.org/) (SemVer):

**MAJOR.MINOR.PATCH** (e.g., `1.2.3`)

- **MAJOR** version: Breaking changes that require user action
- **MINOR** version: New features (backward compatible)
- **PATCH** version: Bug fixes and minor improvements (backward compatible)

---

## 📅 Release Cycle

### Regular Releases
- **Patch releases**: As needed (bug fixes, security updates)
- **Minor releases**: Every 4-6 weeks (new features)
- **Major releases**: Annually or when breaking changes are necessary

### Pre-releases
- **Alpha** (`v1.0.0-alpha.1`): Internal testing, unstable
- **Beta** (`v1.0.0-beta.1`): Public testing, mostly stable
- **RC** (`v1.0.0-rc.1`): Release candidate, stable and feature-complete

---

## 🏷️ Release Process

### 1. Planning
- Feature freeze 1 week before release
- Review roadmap and prioritize issues
- Create a release milestone on GitHub

### 2. Development
- All changes go through pull requests
- Code review required for all PRs
- Automated tests must pass
- Update documentation

### 3. Testing
- Manual testing on desktop and mobile
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Test on different screen sizes
- Security audit for major releases

### 4. Release
1. Update version in `package.json`
2. Update `CHANGELOG.md` with all changes
3. Create a git tag: `git tag -a v1.0.0 -m "Release v1.0.0"`
4. Push tag: `git push origin v1.0.0`
5. Create GitHub Release with release notes
6. Deploy to production (Vercel auto-deploys)
7. Announce on social media and community channels

### 5. Post-Release
- Monitor for critical bugs
- Respond to user feedback
- Plan hotfixes if needed

---

## 📝 Changelog

Every release includes a `CHANGELOG.md` update with:

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Features that will be removed
- **Removed**: Features that were removed
- **Fixed**: Bug fixes
- **Security**: Security updates

Example:
```markdown
## [1.2.0] - 2025-01-15

### Added
- Global search palette (Ctrl/Cmd+K)
- Mobile drawer navigation
- Documentation page

### Fixed
- Settings page SSR error
- Mobile header overflow
```

---

## 🔄 Deployment Strategy

### Production (main branch)
- Auto-deployed to Vercel on every merge to `main`
- Requires passing CI/CD checks
- Protected branch (no force pushes)

### Staging (develop branch)
- Auto-deployed to staging environment
- Used for testing before production merge
- Can be unstable

### Development
- Feature branches for all changes
- Format: `feature/feature-name`, `fix/bug-name`
- Merged to `develop` first, then to `main`

---

## 🚨 Hotfix Process

For critical bugs in production:

1. Create branch from `main`: `hotfix/critical-bug`
2. Fix the issue
3. Test thoroughly
4. Merge directly to `main` and `develop`
5. Create patch release immediately
6. Deploy and monitor

---

## 🎯 Release Checklist

Before every release:

- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Breaking changes documented
- [ ] Migration guide (if needed)
- [ ] Screenshots updated (for UI changes)
- [ ] Security review (for major releases)
- [ ] Performance benchmarks
- [ ] Mobile and desktop tested
- [ ] Release notes drafted

---

## 🔐 Security Releases

Security vulnerabilities are handled with urgency:

1. **Report**: Email samuelaboderin@gmail.com
2. **Assess**: Evaluate severity and impact
3. **Fix**: Develop and test patch privately
4. **Release**: Deploy as emergency patch
5. **Announce**: Notify users after patch is live
6. **Post-mortem**: Document lessons learned

---

## 📢 Release Announcements

Every release is announced on:

- GitHub Releases page
- LinkedIn (@samuelaboderin)
- X (Twitter) (@aboderinsamuel)
- README.md (version badge)

Major releases get:
- Blog post (if blog exists)
- Product Hunt launch (for v1.0)
- Email to contributors

---

## 🎉 Major Milestones

### v0.1 (Current)
- ✅ Basic CRUD operations
- ✅ Search and filter
- ✅ Mobile responsive
- ✅ Dark mode

### v1.0 (Target: Q2 2025)
- Offline-first support
- Export/import
- Prompt versioning
- Rich text editor
- Production-ready

### v2.0 (Target: Q4 2025)
- Team collaboration
- Public prompt gallery
- Browser extension
- Mobile apps

---

## 🤝 Contributing to Releases

Contributors can help by:

- Testing pre-releases (beta/RC)
- Reporting bugs early
- Improving documentation
- Translating release notes
- Sharing feedback

---

## 📊 Release Metrics

We track:
- Time between releases
- Number of issues closed
- Community contributions
- User feedback sentiment
- Performance improvements

---

**Current Version**: v0.1  
**Last Release**: November 2025  
**Next Release**: TBD

---

Questions about releases? Open an issue or contact [@aboderinsamuel](https://github.com/aboderinsamuel).
