# Mom Test Notes - VisPubData App

## The 3 Big Questions

1. How do VIS researchers currently find related work, and what is the hardest part about that process? (Goal: Understand the real problem and current workarounds ⤴).
2. When was the last time they missed a critical paper, and what were consequences? (Goal: Assess the severity of the problem ☇).
3. Where do they go to look for VIS papers specifically, and what tools do they currently use? (Goal: Workflow context ^ and current tools ☐).

## Customer Slicing (Personas)

1. **The Novice (Alex, 1st-year PhD Student):** Needs to understand the landscape of a subfield (e.g., node-link graphs) and build a reading list.
2. **The Expert (Dr. Taylor, Associate Professor):** Writes grant proposals, needs to find related work to show novelty, or needs to find reviewers for a paper.
3. **The Surveyor (Sam, Postdoc):** Writing a State-of-the-Art (STAR) report, needs exhaustive coverage of a specific topic over the last 10 years.

---

## Simulated Conversations

### User 1: Alex (1st-year PhD Student)

_Context: Met at a departmental coffee hour._

**Interviewer:** "What are you working on these days?"
**Alex:** "I'm starting a project on evaluating accessibility in data visualization, so I'm trying to read up on what's already been done." ^
**Interviewer:** "Walk me through how you've been finding papers so far."
**Alex:** "Mostly I go to Google Scholar, search for 'accessibility data visualization', and look at the first few pages. I also asked my advisor, and they sent me 3 papers to start with." ⤴
**Interviewer:** "How is that working out for you?"
**Alex:** "It's okay, but it's overwhelming. ☇ Google Scholar gives me a lot of medical imaging papers or generic HCI stuff. I only really care about papers from IEEE VIS or CHI, but it's hard to filter effectively without missing things." ☐
**Interviewer:** "Tell me about the last time you spent a dedicated block of time doing this."
**Alex:** "Yesterday. I spent 3 hours writing down citations from the references section of a 2018 paper my advisor sent me. ⤴ Then I had to manually search each one to see if it was published in a VIS venue. It took forever." ☇

**Key Takeaways (Alex):**

- **Problem:** Generic search tools (Google Scholar) don't filter well by venue, leading to noise.
- **Workaround:** "Citation chaining" (looking at references of a good paper) but doing it manually is tedious.

### User 2: Dr. Taylor (Associate Professor)

_Context: Chatting before a faculty meeting._

**Interviewer:** "How's the grant proposal going?"
**Taylor:** "Stressful as always. I'm trying to make sure our proposed technique hasn't been done in some obscure IEEE VAST paper from 10 years ago." ^
**Interviewer:** "How do you usually check for that?"
**Taylor:** "I rely a lot on my memory, honestly. I've been in the field for 15 years. ⤴ But my students also do a literature pass. Sometimes we use Semantic Scholar."
**Interviewer:** "Has there ever been a time you missed a paper?"
**Taylor:** "Yes, last year we submitted a paper and reviewer 2 pointed out a highly similar paper from 2015 that we completely missed because they used different terminology ('node-link diagram' vs 'graph drawing'). ☇ It was embarrassing." :|
**Interviewer:** "How did you fix your process after that?"
**Taylor:** "We didn't really, there's no good way to search by visual metaphor. We just try to be more careful and search synonyms." ☐

**Key Takeaways (Taylor):**

- **Problem:** Missing previous work due to inconsistent terminology over the years.
- **Consequence:** Embarrassment, potential paper rejection.

### User 3: Sam (Postdoc)

_Context: Zoom call to catch up._

**Interviewer:** "I saw you're working on a STAR report. How's the data collection phase?"
**Sam:** "Brutal. ☇ We're trying to categorize every paper on immersive analytics published in VIS since 2015." ^
**Interviewer:** "Walk me through your data collection process on the last session you did."
**Sam:** "We downloaded the VisPubData spreadsheet. ⤴ We imported it into Excel, filtered by year, and now we are literally reading the title and abstract of 500 papers one by one and tagging them in columns." ⤴
**Interviewer:** "What's the hardest part about that?"
**Sam:** "The spreadsheet is just text. If I'm curious about a paper, I have to copy the title, open IEEE Xplore, paste it, find the PDF, see if they have a video, etc. ☐ It breaks my flow constantly. I wish I could just see similarity clusters or visual previews." ☑

**Key Takeaways (Sam):**

- **Problem:** Analyzing a large corpus systematically requires painful context-switching between spreadsheets and digital libraries.
- **Workaround:** Brute-force reading in Excel.

---

## Synthesis for Product Insights

- **The Problem is Real:** VIS researchers struggle with noise in general search tools, vocabulary mismatch, and tedious workflow friction.
- **Current Alternatives:** Google Scholar, Semantic Scholar, manual reference chaining, raw VisPubData spreadsheet.
- **Unmet Needs:** Venue-specific filtering, similarity by concepts/metaphors rather than exact keywords, and an integrated workflow that prevents context-switching.
