# GPT Instructions: Portfolio Project Format

Use this prompt when asking GPT to format a new project for the portfolio.

---

## Prompt Template

```
You are a portfolio content writer. Format the following project information 
following this exact structure and style:

STRUCTURE:
1. Front matter (YAML block between `---`):
   - title: [Project name]
   - subtitle: [One-line description with key tech]
   - date: [Month YYYY or ISO date for sorting]
   - tags: [List 3-5 relevant tech/domains]
   - categories: [Pick one; allowed list below; match text exactly for filters]
   - image: [Path to project image, e.g., assets/images/projects/project-name.png]
   - overview: [Leave blank, content follows below]

2. Content sections (Markdown):
   - ### **Overview** — 2-3 sentence description of what it does
   - ### **Problem** — Pain point or challenge it solves (2-3 sentences)
   - ### **Architecture Diagram** — Mermaid flowchart showing data/process flow (name the diagram to fit the project)
   - ### **Tech Stack** — Bullet list of key technologies used
   - ### **Key Challenges** — 3-5 bullet points of technical hurdles faced
   - ### **What I Learned** — 3-4 bullet points of lessons/insights gained
   - (Optional) ### **Future Enhancements** — Bullet list of next steps

3. Optional media:
   - demo_gif: [Path to demo GIF] (adds an image in the modal)

4. Links section:
   - Use `links:` with bullet items in the form `- label: URL` (omit items if you do not have a URL)

STYLE GUIDELINES:
- Subtitle format: "[Name] ([Key capability]) ([Main tech])"
- Problem: Be specific about the user pain point
- Architecture: Use a clear flowchart (mermaid) showing inputs → processing → outputs
- Tech Stack: List 6-8 key technologies
- Challenges: Focus on technical complexity, not soft skills
- Learning: Emphasize technical insights or business implications
- Tone: Professional, technical, outcomes-focused
- Length: Each section 1-3 sentences (except lists)
- Avoid standalone lines ending with a colon in the body; colon-terminated lines are treated as key names by the parser.
- Categories (for filtering): use exactly one of
  - AI/Machine Learning
  - Product Management + UX
  - Data + Business Analytics / BI Systems
  - Strategy & Consulting

EXAMPLE STRUCTURE (from understand-ai.txt):
---
title: Understand AI
subtitle: Real-time sales intelligence agent (RAG + automation)
date: Dec 2025
tags:
- n8n
- openai
- engineering
- ollama
categories: AI/Machine Learning
image: assets/images/projects/sales-sense-ai.png
overview: 
---

### **Overview**
[2-3 sentences about what it does]

### **Problem**
[Why this matters / what pain point]

### **Architecture Diagram (Sales RAG System)**
\`\`\`mermaid
flowchart LR
    A[Input] --> B[Process] --> C[Output]
\`\`\`

### **Tech Stack**
- [Technology 1]
- [Technology 2]
...

### **Key Challenges**
- [Challenge 1]
- [Challenge 2]
...

### **What I Learned**
- [Insight 1]
- [Insight 2]
...

---

links:
- demo: [URL] (omit if empty)
- repo: [URL] (omit if empty)
---

Now format the following project information in this exact structure:

[USER PROVIDES PROJECT INFO HERE]
```

---

## Quick Usage Guide

1. **Copy the prompt above** and paste into ChatGPT/Claude
2. **Replace** `[USER PROVIDES PROJECT INFO HERE]` with your project details
3. **Provide context like:**
   - What problem does it solve?
   - What technologies did you use?
   - What was hard about building it?
   - What did you learn?
   - Links to demo/repo (optional)
   - Preferred category (from the allowed list) and image path
4. **Copy the output** and save as `content/projects/[project-name].txt`
5. **Verify** it follows the exact YAML + Markdown structure

---

## Common Pitfalls to Avoid

- ❌ Missing `date` → Use Month YYYY or ISO; drives sorting
- ❌ No `categories` or non-matching text → Use exactly one allowed value so filters work
- ❌ Problem section is too vague → Be specific about user pain
- ❌ Architecture diagram is missing or too simple → Show data flow clearly
- ❌ Tags are too broad → Pick specific tech, not "software" or "coding"
- ❌ Learning section reads like a resume → Focus on technical or business insights, not "I improved my skills"
- ❌ Subtitle is too long → Keep it to ~8 words max
- ❌ Colon at the end of a standalone line in the body → The parser will treat it like a key; rewrite without the trailing colon
- ❌ Links are incomplete → Only include `- label: URL` items you actually have; otherwise omit
- ❌ Extra whitespace or formatting errors → YAML is picky about indentation

---

## File Naming Convention

Save new projects as: `content/projects/[kebab-case-project-name].txt`

Examples:
- `real-time-dashboard.txt`
- `ai-chatbot-service.txt`
- `mobile-payment-app.txt`

---

## Checklist Before Committing

- [ ] YAML front matter is valid (no syntax errors)
- [ ] `date` is set (Month YYYY or ISO)
- [ ] `categories` uses an allowed value (or intentionally omitted)
- [ ] All 6 sections present (Overview, Problem, Architecture, Tech Stack, Key Challenges, What I Learned)
- [ ] Mermaid diagram renders (test in VS Code preview)
- [ ] Subtitle follows pattern: `[Name] ([capability]) ([main tech])`
- [ ] Tags are 3-4 items, specific and relevant
- [ ] Image path is correct and file exists
- [ ] All sections have content (no empty sections)
- [ ] Links section uses `- label: URL` items only when URLs exist
- [ ] No stray colon-terminated standalone lines in the body
