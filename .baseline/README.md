# Baseline Self-Hosting Configuration

This directory contains configuration for using baseline on the baseline repository itself.

## Structure

- `.baseline/` - Baseline workspace configuration directory
- `packages/` - Monorepo packages
  - `core/` - Core library (can be used by baseline itself)
  - `cli/` - CLI tool
  - `gui/` - GUI application

## Using Baseline on This Repo

Once baseline is built and installed, you can use it to manage this monorepo:

```bash
# Initialize baseline workspace (if not already done)
bl init

# Add packages as repositories
bl add packages/core --name core --path packages/core --tags library
bl add packages/cli --name cli --path packages/cli --tags app
bl add packages/gui --name gui --path packages/gui --tags app

# Or use the example baseline.json
cp baseline.json.example baseline.json
```

## Notes

- The `packages/` structure allows baseline to manage itself
- Each package can be treated as a separate repository
- The core package can be used by the CLI and GUI packages
- This enables self-hosting and dogfooding of baseline

