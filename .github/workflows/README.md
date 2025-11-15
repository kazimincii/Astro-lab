# CI/CD Workflows

This directory contains GitHub Actions workflows for automated testing, building, and deployment.

## Available Workflows

### 1. Backend CI (`backend-ci.yml`)

Automatically runs on:
- Push to `main`, `develop`, or `claude/**` branches
- Pull requests to `main` or `develop`
- Only when backend files change

**Jobs:**
- **Test & Lint**: Runs linting, TypeScript compilation, unit tests, and E2E tests
- **Build Docker**: Builds and tests Docker image
- **Security Scan**: Runs npm audit for security vulnerabilities

**Services:**
- PostgreSQL 15 (for tests)
- Redis 7 (for tests)

**Requirements:**
- No secrets required for basic testing
- Optional: `SNYK_TOKEN` for enhanced security scanning
- Optional: `CODECOV_TOKEN` for coverage reports

### 2. Mobile CI (`mobile-ci.yml`)

Automatically runs on:
- Push to `main`, `develop`, or `claude/**` branches
- Pull requests to `main` or `develop`
- Only when mobile files change

**Jobs:**
- **Test & Lint**: Runs linting, TypeScript compilation, and tests
- **Build Expo**: Builds web version of the app
- **Type Check**: Validates TypeScript types

**Requirements:**
- Optional: `EXPO_TOKEN` for Expo builds (get from https://expo.dev/accounts/[account]/settings/access-tokens)
- Optional: `CODECOV_TOKEN` for coverage reports

### 3. Deploy Backend (`deploy-backend.yml`)

Manual deployment workflow (triggered via GitHub UI).

**Inputs:**
- **environment**: Choose between `staging` or `production`

**Usage:**
1. Go to Actions tab in GitHub
2. Select "Deploy Backend" workflow
3. Click "Run workflow"
4. Select environment
5. Click "Run workflow" button

**Customization Required:**
- Add your deployment commands in the workflow file
- Configure deployment secrets in GitHub repository settings
- Set up deployment environments (Settings → Environments)

## Setup Instructions

### 1. Repository Secrets

Add these secrets in: Settings → Secrets and variables → Actions

**Optional but recommended:**
```
EXPO_TOKEN          - Expo access token for mobile builds
CODECOV_TOKEN       - Codecov token for coverage reports
SNYK_TOKEN          - Snyk token for security scanning
```

**For deployment (if using):**
```
DATABASE_URL        - Production database URL
SSH_PRIVATE_KEY     - SSH key for server access
SERVER_HOST         - Deployment server hostname
SERVER_USER         - Deployment server username
DOCKER_USERNAME     - Docker registry username
DOCKER_PASSWORD     - Docker registry password
```

### 2. Environment Configuration

For deployment workflows, configure environments:

1. Go to Settings → Environments
2. Create environments: `staging`, `production`
3. Add environment-specific secrets:
   - `DATABASE_URL`
   - `BACKEND_URL`
   - Other environment-specific variables

4. Optional: Add protection rules for production:
   - Required reviewers
   - Wait timer
   - Deployment branches restriction

### 3. Branch Protection Rules

Recommended branch protection for `main`:

1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
     - Select: `Test & Lint` (backend)
     - Select: `Test & Lint` (mobile)
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings

### 4. Codecov Integration

1. Sign up at https://codecov.io with your GitHub account
2. Add your repository
3. Copy the upload token
4. Add `CODECOV_TOKEN` to repository secrets
5. Coverage reports will appear on PRs automatically

## Customizing Workflows

### Adding New Test Environments

To test against different Node.js versions:

```yaml
strategy:
  matrix:
    node-version: [18, 20]
```

### Adding Deployment Steps

Edit `deploy-backend.yml` and add your deployment commands:

```yaml
- name: Deploy via SSH
  run: |
    scp -r dist/ user@server:/app/
    ssh user@server 'cd /app && pm2 reload app'
```

### Adding Notifications

Add notification steps to workflows:

```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

## Monitoring Workflows

### View Workflow Runs

1. Go to the "Actions" tab in GitHub
2. View all workflow runs
3. Click on a run to see details
4. Click on a job to see logs

### Badges

Add workflow status badges to your README:

```markdown
![Backend CI](https://github.com/username/repo/workflows/Backend%20CI/badge.svg)
![Mobile CI](https://github.com/username/repo/workflows/Mobile%20CI/badge.svg)
```

## Troubleshooting

### Workflow Not Triggering

- Check the `paths` filter - workflow only runs when specified files change
- Verify branch name matches the `branches` filter
- Check if workflow file has syntax errors

### Tests Failing in CI but Passing Locally

- Check environment variables are set correctly
- Verify database/Redis services are healthy
- Look for timing issues (use `waitFor` in tests)
- Check for missing dependencies

### Docker Build Failing

- Ensure Dockerfile is in the correct location
- Check all required files are included (not in .dockerignore)
- Verify base image is accessible
- Check for sufficient disk space

### Coverage Upload Failing

- Verify coverage files are generated in the correct location
- Check `CODECOV_TOKEN` is set correctly
- Ensure coverage report format is supported (lcov, coverage.xml, etc.)

## Best Practices

1. **Fast Feedback**: Keep test suites fast (< 5 minutes)
2. **Fail Fast**: Run quick checks (lint, type check) before slow tests
3. **Caching**: Use npm/yarn cache to speed up installs
4. **Parallel Jobs**: Run independent jobs in parallel
5. **Matrix Testing**: Test multiple Node versions/environments
6. **Clear Names**: Use descriptive job and step names
7. **Notifications**: Set up failure notifications
8. **Security**: Never commit secrets, use GitHub Secrets
9. **Documentation**: Document custom workflows and secrets

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Expo GitHub Actions](https://docs.expo.dev/build-reference/github-actions/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Jest Testing](https://jestjs.io/docs/getting-started)
