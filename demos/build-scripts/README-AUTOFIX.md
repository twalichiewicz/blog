# Claude Auto-Fix System for Demo Standards

This system automatically fixes failing demo validation tests by invoking Claude to analyze and fix the issues.

## Quick Start

### 1. Set up your API key

```bash
# Add to your .env or shell profile
export CLAUDE_API_KEY="your-anthropic-api-key"
```

### 2. Run tests with auto-fix

```bash
# Run all tests with auto-fix enabled
npm run test:autofix

# Run only demo standards validation with auto-fix
npm run test:autofix:demos

# Fix demo issues directly
npm run fix:demos
```

## How It Works

1. **Test Failure Detection**: When validation tests fail, the system captures the error output
2. **Error Parsing**: Extracts specific validation errors and their context
3. **Claude Analysis**: Sends the errors and relevant code to Claude for analysis
4. **Fix Generation**: Claude generates specific code fixes in JSON format
5. **Auto-Application**: Fixes are automatically applied to the codebase
6. **Re-validation**: Tests are re-run to verify fixes (up to 3 times)

## Usage Examples

### Local Development

```bash
# Dry run - see what would be fixed without applying
DRY_RUN=true npm run fix:demos

# Fix and create a git commit
npm run fix:demos && git add -A && git commit -m "Fix demo standards"

# Run with custom Claude model (faster/cheaper)
CLAUDE_MODEL=claude-3-sonnet-20240229 npm run fix:demos
```

### CI/CD Integration

The system includes GitHub Actions workflow that:
- Triggers on pushes to feature branches
- Runs validation with auto-fix
- Creates a PR with fixes if needed

```yaml
# Manual trigger from GitHub UI
workflow_dispatch:
  inputs:
    dry_run:
      description: 'Dry run (show fixes without applying)'
      required: false
      default: 'false'
```

## Configuration

### Environment Variables

- `CLAUDE_API_KEY` or `ANTHROPIC_API_KEY`: Your Anthropic API key (required)
- `CLAUDE_AUTO_FIX`: Set to `false` to disable auto-fixing (default: `true`)
- `CLAUDE_MODEL`: Claude model to use (default: `claude-3-opus-20240229`)
- `DRY_RUN`: Set to `true` to preview fixes without applying
- `MAX_RETRIES`: Maximum fix attempts (default: 3)

### Supported Fix Types

The system can automatically fix:

1. **Missing Demo Wrapper**: Adds `DemoWrapper` import and usage
2. **Missing Onboarding**: Creates onboarding steps and integrates `DemoOnboarding`
3. **Incorrect Props**: Fixes prop names and values
4. **Import Issues**: Adds missing imports from shared components
5. **Build Configuration**: Updates `vite.config.js` for proper asset paths
6. **Package Dependencies**: Adds missing dependencies to `package.json`

### Fix Format

Claude returns fixes in this JSON format:

```json
{
  "fixes": [
    {
      "file": "src/App.jsx",
      "action": "update",
      "content": "// Full updated file content"
    },
    {
      "file": "package.json",
      "action": "update", 
      "content": "// Full updated package.json"
    }
  ],
  "explanation": "Added DemoWrapper and fixed onboarding integration"
}
```

## Security Considerations

1. **API Key Storage**: Never commit API keys. Use environment variables or GitHub Secrets
2. **Review Changes**: Always review auto-generated fixes before merging
3. **Limited Scope**: The system only fixes demo-related issues, not general code problems
4. **Rate Limiting**: Be aware of Anthropic API rate limits

## Cost Estimation

- Each fix attempt uses ~2000-4000 tokens
- With Claude 3 Opus: ~$0.10-0.20 per demo fix
- With Claude 3 Sonnet: ~$0.01-0.02 per demo fix

## Troubleshooting

### Common Issues

1. **"No API key found"**
   ```bash
   export CLAUDE_API_KEY="sk-ant-..."
   ```

2. **"Failed to parse Claude's response"**
   - Claude may have returned explanatory text instead of JSON
   - Check the console output for the raw response

3. **"Max retries reached"**
   - Some issues may be too complex for automatic fixing
   - Review the errors and fix manually

### Debug Mode

```bash
# Enable verbose logging
DEBUG=true npm run fix:demos

# Save Claude responses to file
SAVE_RESPONSES=true npm run fix:demos
```

## Extending the System

### Adding New Test Types

Edit `test-with-autofix.js`:

```javascript
const TEST_CONFIGS = {
  'my-test': {
    command: 'npm',
    args: ['run', 'my-test-script'],
    name: 'My Custom Test',
    autoFixEnabled: true
  }
};
```

### Custom Error Parsers

Implement custom error parsing in `auto-fix-with-claude.js`:

```javascript
function parseCustomErrors(output) {
  // Your custom parsing logic
  return errors;
}
```

## Best Practices

1. **Use in Feature Branches**: Don't run auto-fix directly on main/master
2. **Review PR Carefully**: Auto-generated code should always be reviewed
3. **Combine with Manual Fixes**: Use for routine fixes, handle complex issues manually
4. **Monitor Costs**: Track API usage to avoid unexpected charges
5. **Keep Context Small**: The system works best with focused, specific errors

## Future Enhancements

- [ ] Support for more file types (CSS, config files)
- [ ] Integration with other LLMs (GPT-4, Gemini)
- [ ] Caching of common fixes
- [ ] Learning from past fixes
- [ ] Parallel fix processing
- [ ] Web UI for reviewing fixes