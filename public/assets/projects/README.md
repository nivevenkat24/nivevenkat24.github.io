# Project Assets

This folder contains all project-related files organized by project name.

## Structure

Each project folder should contain:
- **thumbnail.jpg/png** - Main project image (recommended: 1200x630px)
- **report.pdf** - Final report or analysis document
- **presentation.pptx/pdf** - Presentation slides
- **notebook.html** - Exported Jupyter notebook (if applicable)
- **demo-video.mp4** - Demo video (if applicable)
- **README.md** - Quick project overview (optional)

## How to Add Files

1. Navigate to the project folder: `public/assets/projects/[project-name]/`
2. Add your files (PDFs, images, presentations, etc.)
3. Update the project's `.txt` file in `content/projects/` to reference these files:

```
image: assets/projects/[project-name]/thumbnail.jpg
files:
- label: Final Report
  url: assets/projects/[project-name]/report.pdf
- label: Presentation
  url: assets/projects/[project-name]/presentation.pdf
```

## File Size Guidelines

- **Images**: Keep under 500KB (optimize with TinyPNG or similar)
- **PDFs**: Keep under 5MB when possible
- **Videos**: Consider hosting on YouTube/Vimeo and linking instead
- **GitHub file limit**: 100MB per file

## Current Projects

- customer-churn
- submittal-ai
- jobsafety-ai
- chocolate-sales
- trunk-tools
- tao-climate
- morningstar-climate
- tripadvisor-project
- verra-perfume
- scentscout
- air-france-ads
- mobile-app-rank
- ad-ranking-model
- billionaire-wealth
- hr-analytics
- life-expectancy
- philippines-macro
- cinemex-pricing
