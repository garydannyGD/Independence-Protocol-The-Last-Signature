# Independence Protocol — The Last Signature

An original cinematic conversation game for diploma auditing students. Join a nighttime audit of fictional Meridian Group. Inspect documents, speak to clients and colleagues, identify independence threats and select effective responses. Inspired by the *format* of branching cinematic games; all characters, story, graphics and music are original.

## Files

```text
index.html                  ← publishing folder root
style.css                   ← responsive interface
art.js                      ← original animated low-poly 3D renderer
audio.js                    ← four tracks, tempo mixer, effects and chatter
script.js                   ← clearly labelled editable story/question bank
README.md
TEACHER_GUIDE.md             ← answer key and classroom guidance
```

No build, installation, backend, API key, CDN, font download or additional assets are required. Everything runs in the browser. The separately supplied `Independence_Protocol_Complete.html` combines the same HTML, CSS, renderer, audio engine and game script into one file.

## Play locally

1. Extract the ZIP first. Keep the files together.
2. Double-click `index.html` to open it in a current Chrome, Edge, Firefox or Safari browser. Alternatively, open the single-file HTML.
3. Enter a name, choose audio/motion preferences and select **Open the case**.
4. Read the dialogue. Continue the conversation, inspect the evidence, then select a response.
5. Read feedback at your own pace and select **Continue**. There are no timed choices or speed points.

Controls: mouse/touch or Tab/Enter; keys **1–4** choose a visible response, **G** opens the field guide, **Escape** closes a dialog. Enter advances dialogue/feedback when focus is not already on a button/link. Sound is enabled only after user interaction; the top-bar toggle mutes it. Changing tabs mutes the music. Use the toggle to resume. Reduced motion disables rain/camera/character animation.

Wrong decisions produce non-graphic fictional custody, death or dismissal endings. Each chapter has a checkpoint. A checkpoint retry preserves the first answer, all attempt history and inspected evidence. A **full restart** creates a new learning attempt and clears those results. Home has a **Resume current case** button. Closing/reloading the page clears the session: checkpoints are not saved across visits.

The debrief appears after failure and success. It shows first-answer accuracy out of questions encountered, current path progress, incorrect-answer explanations, best responses and targeted revision sections. Students can download a text copy. A name is used only in the current browser session; there is no tracking or teacher dashboard.

## Audio boost v3 — start here if you cannot hear it

1. Download and open the latest complete HTML in a full browser tab, or update **all** source files on GitHub, including `audio.js`. Look for **AUDIO BOOST · v3** beneath the header so you know the new version loaded.
2. Press **Enable sound**, then **Test beep**. These are deliberate click/touch actions to unlock browser audio. The status strip shows whether the audio engine is ready or paused/blocked.
3. Use the always-visible **Music ON/OFF**, **Voice ON/OFF** and **Effects ON/OFF** switches. Turning Voice ON while a conversation is visible replays that line. **Replay voice** also appears beside the speaker’s name.
4. Defaults are now Master 85%, Music 70%, Effects 85% and Voice 95%. Open **Music & FX** to adjust them. The output has a limiter to control combined peaks; the voice syllables now sustain and are no longer muffled by a bandpass filter.
5. If the beep is still silent, check the browser tab/site mute, device speaker/output volume, and whether the HTML is only being shown inside a restricted file/LMS preview. Open the downloaded HTML directly in Chrome/Edge/Firefox/Safari, or use the published Pages link. Refreshing the hosted game after updating may be necessary if the old version is cached.

The test beep bypasses the Music, Voice and Effects switches but still obeys the master volume and master mute. It does not claim that your speakers are audible: the status means the tones were scheduled. No website can override a muted browser/device or an institutional content restriction.

## Choose the mood

Open **Music & FX** in the top bar at any time:

| Track | Base tempo | Character |
| --- | --- | --- |
| Midnight Pursuit (default) | 116 BPM | Driving bass, ticking percussion and minor-key arpeggio |
| Neon Investigation | 128 BPM | Quicker electronic detective theme |
| Broken Alibi | 104 BPM | Tense cinematic pulse |
| Night Watch | 88 BPM | Softer mystery |

- **Playback speed:** 0.80× to 1.50×; the display shows the resulting BPM. Tempo changes do not change pitch.
- **Music volume**, **ending/answer effects**, and **character chatter** have separate volume controls, plus a master volume slider. Effects and chatter can be disabled independently.
- **No music** keeps effects and chatter available. **Sound off** mutes everything.
- **Preview music**, **Jail effect**, and **Hear chatter** let students audition sounds. A muted/disabled channel cannot be previewed until enabled. Use Test beep for an independent playback check.
- Dialogue uses bounded, character-specific gibberish phrases. Advancing, opening evidence, leaving the scene or answering stops old chatter immediately. Music dips while characters speak, then returns to the selected level.
- Jail: metallic cell-door clang, keys and a short siren. Death: slowing heartbeat and signal drop. Dismissal: access-denied beeps. Victory: rising chime. Correct answers: a soft two-note confirmation.
- Effects are brief and play once per ending/answer. Checkpoint retry/full restart clears any old ending cue. No new audio files or internet access are needed.

The mixer keeps its choices during the current visit, including checkpoint retries and full restarts. It does not store them after refreshing the page. Browser audio must be enabled by a user gesture. If the browser blocks audio, the learning game remains playable.

## Publish a NEW GitHub repository

1. Sign in to GitHub. Choose **New repository** and give it a name such as `independence-protocol`. Choose a repository visibility/account plan that supports Pages (public is simplest).
2. Create the repository. Choose **Add file → Upload files**.
3. Upload the **contents** of the extracted folder: `index.html`, `style.css`, `art.js`, `audio.js`, `script.js`, `README.md` and `TEACHER_GUIDE.md`. Do not upload only the ZIP. Ensure `index.html` is at the repository root, not inside another folder.
4. Commit the files to the main branch.
5. Open **Settings → Pages**. Choose **Deploy from a branch**, branch **main**, folder **/(root)**, then Save. GitHub’s wording may vary as its interface changes.
6. When deployment completes, open the website URL shown there. A project URL usually has the form `https://YOUR-USERNAME.github.io/independence-protocol/`.
7. Test that published URL on a computer and phone before sharing it with students. Editing and committing the source files updates the published game after redeployment.

Official setup reference: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

All game paths are relative, so a GitHub Pages project subpath works. This is a separate game and can live in a separate repository from the cost accounting game.

## Blackboard

The most reliable method is to publish the game and add its GitHub Pages URL as a Blackboard web link. You can also upload the standalone HTML as a content file if your institution allows active HTML/JavaScript, then open it in a new tab. Do not paste the whole game into a rich-text editor: Blackboard may strip scripts or block audio. Ask your LMS administrator about allowed HTML file content if it is blocked. No iframe or Blackboard API is required by the game itself.

## Edit the questions and story

Open `script.js` in a plain-text/code editor. The first block is labelled **EDITABLE QUESTION & STORY BANK**.

- `CHAPTERS`: chapter title, location, fictional time and map summary.
- `DECISIONS`: one object per scored choice. Keep chapters grouped in order, with consecutive chapter numbers starting at 0.
- `id`: unique and stable for each decision.
- `chapter`: index of the chapter in `CHAPTERS`.
- `person`: `vale`, `maya`, `iris`, `noah` or `chair`; `room`: `office`, `archive`, `boardroom` or `roof`.
- `dialogue`: lines of speech, with `{name}` where the student’s name should appear.
- `narrative`, `evidence.title`, `evidence.body`: contextual information and inspectable document.
- `question`: decision prompt; `topic`: a field-guide category.
- `options`: four `o('response', 'why this response is right/wrong', true)` entries. **Exactly one** must have `true`. The other three omit it. Display order is shuffled automatically.
- `explanation`, `note`: feedback, justification and reading recommendation.
- `failure`: `custody`, `death` or `dismissed`; `success`: the immediate narrative result.

Progress and results use the bank length automatically. Update any homepage/README counts and the teacher answer key if you add or remove decisions. Update the `FIELD_GUIDE` entries to match your syllabus. Use straight code quotes; escape apostrophes inside single-quoted strings. All names and editable game text are placed into the interface as text, not executable HTML.

The standalone HTML is a snapshot. If you edit the multi-file version, play that version or regenerate the standalone file by embedding `style.css` in a `<style>` element and `art.js`, then `audio.js`, then `script.js`, in three `<script>` elements at the end of the body. Do not edit just one copy and assume the other is updated.

## Learning basis and limits

Assumptions: English, diploma level, introductory auditing independence. The lecturer’s actual auditing notes were not available for this new game; the 18 decisions are original practice material. Meridian is a fictional private **non-public-interest** entity. Do not apply its service-permission assumptions uncritically to public-interest entities.

The cases cover self-interest, self-review, familiarity, advocacy and intimidation; independence of mind/appearance; financial interests; inducements; management responsibility; escalation; the difference between an effective safeguard and eliminating a prohibited circumstance; and a final transfer case involving a spouse’s holding. The last decision separates independence from sufficient appropriate audit evidence and reporting.

The thriller consequences are **fictional**, not statements that a wrong answer causes imprisonment or death in real professional practice. Some scenarios can create several threats; questions asking for the **main** threat use the most direct fact pattern. Review local rules, current effective Code provisions and your syllabus before using this as assessed work. No marks depend on reading speed or physical skill.

Official reading (checked October 2026):

- IESBA Code and conceptual framework: https://www.ethicsboard.org/iesba-code — Section 120, Part 4A, Sections 510 (financial interests), 521 (relationships), 600 (non-assurance services), 603 (valuation), 610 (corporate finance); Sections 340/420 for inducements/gifts.
- ACCA threat explanations: https://www.accaglobal.com/gb/en/about-us/regulation/ethics/conceptual-framework-ethical-dilemmas.html
- ACCA application to scenarios and management responsibilities: https://www.accaglobal.com/uk/en/student/exam-support-resources/professional-exams-study-resources/p7/technical-articles/exam-tech-ethics.html

There is no copyrighted commercial game content or famous-song recording. Music is an original procedural suspense composition generated by Web Audio. Characters are actual projected low-poly polygon meshes with breathing, head movement, blinking and mouth animation. They are deliberately stylised, not photorealistic AAA characters. Mouth animation follows short synthesised gibberish phrases, not recorded speech; actual dialogue is read on screen.

## Verification completed

- JavaScript syntax checks for all three source scripts.
- Simulated-DOM game-flow tests: the full 18-decision winning path and **all 54 wrong-response branches**.
- Every chapter checkpoint, recovery and preserved first-error result.
- Repeated answer protection, no duplicate scoring, complete restart and home/resume.
- Evidence inspection, deduplicated notebook entries, field guide, case map, response hotkeys and debrief generation/download flow.
- Native canvas rendering of all five characters was inspected and refined.
- Simulated Web Audio API checks: four distinct track arrangements, tempo scaling, separate volumes, voice pitch profiles, previews, ending cues, music ducking, channel mute, master mute, background-tab mute, cancellation of pending starts and cleanup of scheduled sounds. Added v3 tests cover sustained unfiltered syllables, higher default levels, limiter wiring, first-line playback after unlock, replay, three visible channel switches, independent test beep, and suspended/refused-resume recovery. This is not an audible device playback test.
- Relative-file and standalone packaging checks.

**Verification limit:** no browser was available in this environment. The logic was run, and the canvas art was rendered, but browser layout, actual audio playback, native download behaviour and physical touch controls were not device-tested. Run the checklist below before classroom use.

## Manual browser/device checklist

- [ ] Desktop and phone: home layout fits; enter a name and start.
- [ ] AUDIO BOOST · v3 is visible. Enable sound → Test beep produces two clearly audible tones in a full browser tab.
- [ ] Music begins after starting; Mute all/Enable sound works; a backgrounded tab mutes all sounds.
- [ ] Music, Voice and Effects switches visibly change ON/OFF and independently control their sounds. Voice ON replays the current dialogue.
- [ ] The very first dialogue has audible chatter after browser audio resumes. Replay voice repeats the displayed line. A paused audio engine resumes on a new user gesture.
- [ ] If the browser refuses audio, the visible status reports paused/blocked rather than claiming Audio ready. Master slider and output limiter work without harsh clipping.
- [ ] Music & FX opens/closes with mouse/touch and Escape. Each of the four tracks sounds distinct; changing track stops the previous one.
- [ ] Tempo changes speed from 0.80× to 1.50× and the BPM label updates.
- [ ] Music, effects and chatter volumes respond independently; No music keeps effects/chatter working.
- [ ] Previews work for enabled channels. Disabling a channel stops its sound. Master mute immediately stops all audio, including queued chatter.
- [ ] Each character makes a short, different-pitched gibberish phrase for each line. Music dips while they speak. Chatter stops on choices, evidence, home, mute and after the phrase ends.
- [ ] Jail has a clang/siren, death has a heartbeat/signal drop, dismissal has access-denied beeps and victory has a chime. Correct responses have a soft confirmation.
- [ ] Rapid dialogue clicks, repeated ending clicks and checkpoint retries do not leave old sounds playing.
- [ ] Reduced motion stops character/camera/rain animation.
- [ ] Character and location change across chapters; text is readable at 320, 390, 768 and 1440px widths and at 200% zoom.
- [ ] Evidence opens and closes; Escape and close button work; notebook contains each inspected item once.
- [ ] Dialogue Continue and response buttons work with mouse, touch and Tab/Enter; response keys 1–4 work only when choices are visible.
- [ ] Correct response shows an explanation and waits for Continue.
- [ ] Repeated clicks do not add duplicate answers.
- [ ] Choose wrong in chapter 1: custody ending and expanded incorrect-answer review appear.
- [ ] Choose wrong in chapter 5: non-graphic death ending appears.
- [ ] Choose wrong in a dismissal branch: the dismissal ending appears.
- [ ] Retry checkpoint: starts that chapter, preserves first-answer results, and can proceed to success.
- [ ] Win the complete case: results show all 18 decisions and all explanations.
- [ ] Download notes: opens/saves a readable text file containing the name, selected responses, explanations and reading links.
- [ ] Home → Resume returns to the same view. Full restart starts at chapter 1 with zero answers. Refresh clears session data as documented.
- [ ] Test the actual GitHub Pages / Blackboard-linked URL on the students’ devices.
