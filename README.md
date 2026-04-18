# Bar Editorials Reader

A Next.js + TypeScript web application for law students to read court judgments (คำพิพากษาฎีกา) from CSV data.

## Features

- **Filter by Section (ภาค)**: 
  - ภาค 1 (from Bar_Editorials_1.csv) - Years 63-78
  - ภาค 2 (from Bar_Editorials_2.csv) - Years 63-77
- **Filter by Year (สมัย)**: Select academic year
- **Filter by Law (กฎหมาย)**: อาญา, แพ่ง, วิ.อาญา, วิ.แพ่ง
- **Search**: Full-text search across all fields
- **View Modes**: List, Detailed (navigation), Cards
- **Download**: Export individual cases as text files

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Data Structure

Each entry contains:
- **Fact (ข้อเท็จจริง)**: Factual scenario
- **Question (คำถาม)**: Legal question to answer
- **Judgement (คำตอบ)**: Court judgment/answer
- **Law (กฎหมาย)**: Applicable law category
- **Comment (ข้อสังเกต)**: Instructor's notes

## Deployment

To deploy to GitHub Pages:

1. Update `homepage` in `package.json` with your GitHub username and repo name
2. Run: `npm run deploy`

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- PapaParse for CSV handling