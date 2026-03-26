# OpenAI Cost Analysis Report
**Period:** October 1, 2025 - March 26, 2026  
**Generated:** March 26, 2026

---

## 💰 Total Cost Summary

| Period | Cost (USD) | Cost (GBP) |
|--------|------------|------------|
| **October 2025** | $2.01 | £1.59 |
| **November 2025** | $0.72 | £0.57 |
| **December 2025** | $0.00 | £0.00 |
| **January 2026** | $0.01 | £0.01 |
| **February 2026** | $7.63 | £6.03 |
| **March 2026** | $0.18 | £0.14 |
| **TOTAL** | **$10.55** | **£8.34** |

**Exchange Rate Used:** 1 USD = 0.79 GBP

---

## 📊 Financial Analysis

### Revenue vs Cost
- **Total Revenue (Oct 1, 2025 - Mar 26, 2026):** £64.51
- **Total OpenAI Costs:** £8.34
- **Net Profit:** £56.17
- **Profit Margin:** 87.1%

### Cost Breakdown
- **AI Model Usage (GPT-4o-mini):** $10.19 (96.6%)
- **Text-to-Speech (TTS):** $0.16 (1.5%)
- **Embeddings:** $0.0000005 (0.0%)

---

## 📅 Monthly Breakdown

### October 2025
**Total:** $2.01 (£1.59)

**Daily Costs:**
- Oct 2: $0.0047
- Oct 3: $0.0000002
- Oct 4: $0.20
- Oct 6: $0.80
- Oct 8: $0.44
- Oct 9: $0.32
- Oct 16: $0.24
- Oct 23: $0.0005

**Analysis:** Early testing phase with sporadic usage. Peak on Oct 6 ($0.80).

---

### November 2025
**Total:** $0.72 (£0.57)

**Daily Costs:**
- Nov 5: $0.18
- Nov 6: $0.04
- Nov 7: $0.24
- Nov 8: $0.04
- Nov 9: $0.20
- Nov 10-14: $0.01 (small tests)

**Analysis:** Moderate usage, mostly testing and development.

---

### December 2025
**Total:** $0.00 (£0.00)

**Analysis:** Minimal to zero usage. All entries show "0E-6176" (essentially $0.00). Likely a quiet period or free tier usage.

---

### January 2026
**Total:** $0.01 (£0.01)

**Daily Costs:**
- Jan 16: $0.0007
- Jan 19: $0.0009
- Jan 20: $0.0032
- Jan 21: $0.0000002
- Jan 22: $0.0022
- Jan 28: $0.0000003

**Analysis:** Very light usage, mostly testing.

---

### February 2026
**Total:** $7.63 (£6.03)

**Daily Costs:**
- Feb 3: $0.0021
- Feb 4: $0.000004
- Feb 5: $0.0000003
- **Feb 9: $7.62** ⚠️ **SPIKE!**

**Analysis:** Major spike on Feb 9 ($7.62). This represents 72% of total costs. Likely a bulk operation, testing, or production usage spike.

---

### March 2026 (Mar 1-26)
**Total:** $0.18 (£0.14)

**Daily Costs:**
- Mar 8: $0.16 (TTS - Text-to-Speech)
- Mar 9: $0.0000005 (Embeddings)
- Mar 10: $0.0077 (GPT-4o-mini)

**Analysis:** Light usage. Notable TTS usage on Mar 8 ($0.16) - possibly for NotebookLLM video creation.

---

## 🔍 Detailed Cost Breakdown

### By Service Type

| Service | Total Cost (USD) | Percentage |
|---------|------------------|------------|
| GPT-4o-mini (input) | ~$5.10 | 48.3% |
| GPT-4o-mini (output) | ~$5.09 | 48.2% |
| GPT-4o-mini (cached) | ~$0.00 | 0.1% |
| Text-to-Speech (TTS) | $0.16 | 1.5% |
| Text Embeddings | $0.0000005 | 0.0% |

### Usage Patterns

**GPT-4o-mini Pricing:**
- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens
- Cached Input: $0.075 per 1M tokens (50% discount)

**Estimated Token Usage:**
- **Input tokens:** ~34 million tokens
- **Output tokens:** ~8.5 million tokens
- **Total tokens:** ~42.5 million tokens

**Average per generation (estimated):**
- ~2,000 input tokens
- ~1,500 output tokens
- ~3,500 total tokens per CV generation

**Estimated CV generations:** ~12,140 generations

---

## 🚨 Notable Events

### February 9, 2026 - Major Spike
**Cost:** $7.62 (72% of total costs)

**Possible causes:**
1. **Production launch** - High user traffic
2. **Bulk testing** - Testing multiple CV generations
3. **Failed retries** - API errors causing repeated calls
4. **Long job descriptions** - Unusually large inputs
5. **Cover letters/interview prep** - Additional features used heavily

**Recommendation:** Review logs for Feb 9 to identify cause and prevent future unexpected spikes.

---

## 💡 Cost Optimization Opportunities

### 1. Implement Caching ✅
**Current:** Some cached input usage detected  
**Savings:** 50% on repeated prompts  
**Action:** Ensure system prompts are cacheable

### 2. Reduce Token Usage
**Current:** ~3,500 tokens per generation  
**Target:** ~2,500 tokens per generation  
**Savings:** ~28% cost reduction  
**Actions:**
- Optimize system prompts
- Trim unnecessary context
- Use more concise job descriptions

### 3. Rate Limiting
**Issue:** Feb 9 spike ($7.62)  
**Solution:** Implement daily/hourly cost limits  
**Action:** Set OpenAI usage alerts at $5/day

### 4. Batch Processing
**Current:** Real-time generation  
**Alternative:** Queue non-urgent requests  
**Savings:** Better cost predictability

### 5. Model Selection
**Current:** GPT-4o-mini (good choice!)  
**Alternative:** GPT-3.5-turbo for simpler tasks  
**Savings:** 67% cheaper ($0.50 vs $0.15 input)

---

## 📈 Projections

### Monthly Average
**Average monthly cost:** $1.76 (£1.39)  
**Excluding Feb 9 spike:** $0.49 (£0.39)

### Annual Projection
**Based on current average:** $21.12/year (£16.68)  
**Based on average excluding spike:** $5.88/year (£4.65)

### Cost per £1 Revenue
**Current:** £0.13 OpenAI cost per £1 revenue  
**Profit per £1:** £0.87

---

## 🎯 Recommendations

### Immediate Actions
1. ✅ **Review Feb 9 logs** - Identify spike cause
2. ✅ **Set cost alerts** - $5/day, $50/month limits
3. ✅ **Optimize prompts** - Reduce token usage by 20%
4. ✅ **Enable caching** - For system prompts

### Long-term Strategy
1. **Monitor daily costs** - Track in dashboard
2. **A/B test prompts** - Find most efficient versions
3. **Implement quotas** - Limit free tier usage
4. **Consider batch processing** - For non-urgent requests

---

## 📊 Cost Efficiency Metrics

### Cost per User Acquisition
**Assuming 10,000+ users:**
- **Cost per user:** $0.001 (£0.0008)
- **Extremely efficient!**

### Cost per Generation
**Estimated 12,140 generations:**
- **Cost per generation:** $0.0009 (£0.0007)
- **Revenue per generation:** £0.0053
- **Profit per generation:** £0.0046

### ROI
**Return on Investment:**
- **Revenue:** £64.51
- **OpenAI Costs:** £8.34
- **ROI:** 674%

---

## ✅ Conclusion

**Your OpenAI costs are VERY reasonable!**

### Key Findings:
1. ✅ **Total cost:** £8.34 (only 12.9% of revenue)
2. ✅ **Profit margin:** 87.1% - Excellent!
3. ✅ **Cost per generation:** £0.0007 - Very efficient
4. ⚠️ **Feb 9 spike:** £6.03 - Investigate and prevent
5. ✅ **GPT-4o-mini:** Good model choice for cost efficiency

### Bottom Line:
**You've made £56.17 profit after OpenAI costs.**  
**That's an 87.1% profit margin - excellent for a SaaS product!**

### Next Steps:
1. Investigate Feb 9 spike
2. Set up cost monitoring/alerts
3. Optimize prompts to reduce tokens by 20%
4. Continue with current model (GPT-4o-mini is perfect)

---

**Great job keeping costs low while delivering value!** 🎉
