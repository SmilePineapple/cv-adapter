# SEO MCP Setup Guide

## Installation Status: ✅ COMPLETE

The SEO MCP server has been successfully installed and configured for Windsurf.

## What Was Installed

- **Package**: `seo-mcp` v0.2.4
- **Location**: `C:\Users\jaket\AppData\Local\Programs\Python\Python313\Lib\site-packages\seo_mcp`
- **Python**: 3.13.1

## Configuration File

**Location**: `C:\Users\jaket\AppData\Roaming\Windsurf\User\globalStorage\mcp_config.json`

```json
{
  "mcpServers": {
    "seo-mcp": {
      "command": "python",
      "args": [
        "-m",
        "seo_mcp"
      ],
      "env": {
        "CAPSOLVER_API_KEY": "YOUR_CAPSOLVER_API_KEY_HERE"
      }
    }
  }
}
```

## Next Steps

### 1. Get CapSolver API Key

1. Go to https://www.capsolver.com/
2. Register for an account
3. Get your API key from the dashboard

### 2. Update Configuration

Edit the config file and replace `YOUR_CAPSOLVER_API_KEY_HERE` with your actual API key:

```powershell
notepad "C:\Users\jaket\AppData\Roaming\Windsurf\User\globalStorage\mcp_config.json"
```

### 3. Restart Windsurf

After adding your API key, restart Windsurf to load the MCP server.

## Available SEO Tools

Once configured, you'll have access to these SEO analysis tools:

### 1. **Google Search Console Analysis**
- Fetch search performance data
- Analyze indexing issues
- Get coverage reports
- Monitor search queries

### 2. **Keyword Research**
- Find related keywords
- Analyze keyword difficulty
- Get search volume data
- Discover long-tail opportunities

### 3. **Competitor Analysis**
- Analyze competitor rankings
- Compare backlink profiles
- Identify content gaps
- Track ranking changes

### 4. **Technical SEO Audit**
- Check page speed
- Analyze meta tags
- Verify structured data
- Test mobile-friendliness

### 5. **Content Optimization**
- Analyze content quality
- Check keyword density
- Suggest improvements
- Optimize for featured snippets

### 6. **Backlink Analysis**
- Find backlink opportunities
- Analyze link quality
- Track new/lost links
- Identify toxic links

## How to Use

After restarting Windsurf with your API key configured, you can use commands like:

```
@seo-mcp analyze https://www.mycvbuddy.com
@seo-mcp keywords "cv builder uk"
@seo-mcp competitors "free cv builder"
@seo-mcp audit https://www.mycvbuddy.com
```

## Troubleshooting

### MCP Server Not Loading

1. Check the config file path is correct
2. Verify Python is in your PATH
3. Ensure seo-mcp is installed: `pip show seo-mcp`
4. Check Windsurf logs for errors

### API Key Issues

1. Verify your CapSolver API key is valid
2. Check you have credits in your CapSolver account
3. Ensure the key is correctly formatted in the config

### Command Not Found

1. Restart Windsurf completely
2. Check MCP server is listed in Windsurf settings
3. Verify the config file syntax is valid JSON

## Using SEO MCP for Traffic Recovery

Based on our traffic drop analysis, here's how to use SEO MCP:

### Immediate Actions

1. **Audit Current State**
   ```
   @seo-mcp audit https://www.mycvbuddy.com
   ```
   - Check technical SEO issues
   - Verify meta tags
   - Test page speed
   - Analyze mobile-friendliness

2. **Keyword Research**
   ```
   @seo-mcp keywords "cv builder uk"
   @seo-mcp keywords "free cv builder uk"
   @seo-mcp keywords "ats cv optimizer"
   ```
   - Find high-value keywords
   - Identify search intent
   - Discover long-tail opportunities

3. **Competitor Analysis**
   ```
   @seo-mcp competitors "cv builder uk"
   ```
   - See who's ranking for our target keywords
   - Analyze their content strategy
   - Find backlink opportunities

4. **Content Optimization**
   ```
   @seo-mcp optimize-content https://www.mycvbuddy.com/
   @seo-mcp optimize-content https://www.mycvbuddy.com/ats-optimization-guide
   ```
   - Get specific recommendations
   - Improve keyword targeting
   - Optimize for featured snippets

### Weekly Monitoring

1. **Track Rankings**
   - Monitor keyword positions
   - Track competitor movements
   - Identify ranking opportunities

2. **Backlink Analysis**
   - Find new backlink opportunities
   - Monitor competitor backlinks
   - Track link building progress

3. **Content Performance**
   - Analyze top-performing pages
   - Identify content gaps
   - Optimize underperforming content

## Integration with Traffic Recovery Plan

The SEO MCP tools will help with:

### Phase 1: Emergency Fixes ✅
- ✅ Technical SEO audit
- ✅ Redirect chain analysis
- ✅ Indexing issue detection

### Phase 2: Content Expansion (Current)
- 🔄 Keyword research for new content
- 🔄 Content optimization recommendations
- 🔄 Competitor content analysis

### Phase 3: Authority Building
- 📋 Backlink opportunity discovery
- 📋 Competitor backlink analysis
- 📋 Link building strategy

## Expected Results

### Week 1
- Complete technical SEO audit
- Identify top 20 target keywords
- Analyze top 5 competitors

### Week 2-4
- Optimize all key pages
- Create content based on keyword research
- Identify 50+ backlink opportunities

### Month 2-3
- Track ranking improvements
- Monitor backlink acquisition
- Measure traffic recovery

---

**Status**: ✅ Installed, ⏳ Awaiting API Key  
**Next Action**: Get CapSolver API key and update config  
**Documentation**: https://github.com/cnych/seo-mcp
