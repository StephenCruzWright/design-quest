# The evidence behind Design Quest: a literature review of perception, typography and accessibility research for web layout rules

## Abstract

Design Quest teaches web design theory through eight levels whose automatic checks measure the rendered DOM against numeric thresholds. A new content rule requires every sentence a player reads to be either story or a checkable fact, so each perception or design claim needs a source and each studio rule of thumb needs a label. This review collects that fact base. It covers Gestalt grouping research from Wertheimer to the dot-lattice measurements of Kubovy and colleagues; Weber's law and the size of just-noticeable differences for length; salience, visual search and eye-tracking studies of web pages; reading research on measure, leading and type size; the WCAG 2.x contrast ratio, its origin and the APCA alternative; OKLab and OKLCH; research on alignment, balance and whitespace; and the practitioner sources the game's tokens are modelled on. The main findings are these. Grouping by proximity is fast and strong, and it depends on the ratio of gaps rather than their absolute size; in dot lattices a ratio of about 1.5 already decides the grouping almost every time. Weber fractions for line length are about 3 to 4 percent, so the lesson claim that 28px and 32px "look the same" is false as stated. No located study supports a specific spacing-scale ratio, a two-family font limit or a 1.2 heading ratio; these are practice or studio rules. The 4.5:1 contrast ratio is a standard derived from an ISO recommendation plus an acuity adjustment, not from a reading-speed experiment. The review closes with a claims audit and a level-by-level map of which thresholds are research-backed, standard-backed or studio rules.

## 1. Method and evidence labels

Sources were located with web search and direct retrieval of publisher pages, PubMed and Crossref records, author-hosted PDFs and W3C documents. Only sources that were located are cited. Where a figure comes from a secondary account (for example a review describing an older experiment), the text says so. Sources from the brief that could not be located are listed in section 12 and are not cited.

Each claim in this paper carries one of four labels, which the game should reuse:

- **Finding**: an empirical result from a controlled study or a review of such studies.
- **Standard**: a W3C normative requirement or W3C explanatory material.
- **Practice**: published guidance from designers, typographers or design systems, based on craft experience rather than experiment.
- **Studio rule**: a Design Quest threshold chosen by the studio, which may be informed by findings or practice but is not itself a finding.

Study sizes and effect sizes are reported where the located text gave them. Many design-adjacent studies use small, convenience samples (students, lab volunteers) and screen technology that is now old, so the strength of each finding is stated alongside it.

## 2. Gestalt grouping

### 2.1 Origins

Wertheimer's 1923 paper, "Untersuchungen zur Lehre von der Gestalt II" in *Psychologische Forschung* 4, is available in English as "Laws of organization in perceptual forms" in Ellis's 1938 *A source book of Gestalt psychology* [1]. Its first demonstration is a row of dots with alternating intervals of 3 mm and 12 mm, which is "normally" seen as pairs grouped across the small interval. Wertheimer names this "the Factor of Proximity": "that form of grouping is most natural which involves the smallest interval" [1]. He then introduces "the Factor of Similarity", "the tendency of like parts to band together" [1]. Note the ratio in the founding example: the between-pair gap is four times the within-pair gap. The paper is a set of demonstrations, not measurements.

### 2.2 The modern review

The centenary reviews by Wagemans and colleagues in *Psychological Bulletin* are the best single entry point [2, 3]. Part I surveys the classical principles (proximity, similarity, common fate, good continuation, closure, symmetry, parallelism) and the principles added since (synchrony, common region, element connectedness and uniform connectedness), along with figure-ground organisation and how past experience and attention affect it [2]. Part II covers the theoretical foundations [3]. Two points from Part I matter for the game. First, grouping principles can now be measured, not only demonstrated. Second, the status of grouping as "preattentive" is no longer taken for granted (section 2.5).

### 2.3 Common region and uniform connectedness

Palmer introduced **common region**: elements inside the same bounded area tend to be grouped [5]. This is the principle behind cards, panels and bordered fieldsets. Palmer and Rock proposed **uniform connectedness**: the visual system first divides the image into connected regions of uniform (or smoothly changing) luminance, colour, texture or motion, and these regions are the entry-level units that grouping then combines [4]. Wagemans and colleagues report that this foundational status was not uniformly accepted; Kimchi's microgenetic experiments did not support uniform connectedness as the sole determinant of entry-level units [2]. Han, Humphreys and Chen compared uniform connectedness with proximity and similarity and found that grouping by proximity could be as fast as grouping by uniform connectedness in a letter discrimination task [9].

For design, the practical point is that connected and enclosed regions (a filled card, a bordered box) are strong grouping cues, and they can override proximity. A card whose inner gap is larger than the gap to its neighbour can still read as one card if its background is filled. This is why the game's spacing checks should treat a visible container as a confound when it measures between-group and within-group gaps.

### 2.4 Quantifying proximity

The most useful research for the game is the dot-lattice programme of Kubovy, Wagemans and colleagues [6, 7, 8]. Observers saw lattices of dots for 300 ms and reported which orientation of rows they saw. Kubovy and Wagemans modelled the attraction between dots as an exponential decay with a single parameter [6]. Kubovy, Holcombe and Wagemans reanalysed the data and found the **pure distance law**: the probability of seeing a given grouping depends only on the relative distance between dots in competing orientations, not on the lattice type or its symmetry [7]. As Wagemans and colleagues summarise it, plotted as log-odds, all conditions fall on one straight line (the attraction function), whose slope is a person-specific sensitivity to proximity [2]. The same review states the size of the effect directly: "If the ratio of the longer to the shorter vector is larger than about 1.5, grouping along that orientation is almost never seen" [2]. It also notes that the overall scale of the lattice is "unimportant for grouping over a reasonable range" [2].

An older measurement points the same way. Oyama (1961, as summarised in [2]) recorded how long observers saw horizontal versus vertical groupings in rectangular lattices and found the ratio of viewing times was a power function of the ratio of distances, with an exponent of about 2.89 [2]. Taking that exponent at face value, a distance ratio of about 1.27 gives a 2:1 preference in viewing time, and a distance ratio of 2 gives roughly 7:1 (this arithmetic is ours, not Oyama's).

Kubovy and van den Berg extended the method to proximity and similarity together. In three experiments with dot lattices, the strength of the combined effect of proximity and luminance similarity was equal to the sum of their separate effects measured on a log-odds scale [8]. Grouping cues add up; they do not interact in complex ways in these displays.

**Strength and limits.** These are well-controlled psychophysical findings with converging methods. They come from dot patterns, briefly shown, with no text, no borders and no task beyond reporting orientation. A web page has elements of different sizes, edges that are not points, and competing cues (colour, borders, alignment). The ratio principle (relative, not absolute, distance) transfers directly. The specific 1.5 figure is a lower bound under ideal conditions, not a design target.

### 2.5 Timing and attention

Two separate questions are often merged in design writing: how fast grouping happens, and whether it needs attention.

**Speed.** Ben-Av and Sagi measured grouping with a backward mask at varying stimulus onset asynchronies (SOA) [11]. As described by Rashal, Yeshurun and Kimchi, evidence of proximity grouping appeared with an SOA of 60 ms, while grouping by shape similarity appeared only at 160 ms [16]. Han and colleagues recorded event-related potentials and found a proximity-related positive activity at 100 to 120 ms after stimulus onset over medial occipital cortex, whereas grouping by shape similarity appeared only in a negativity with an onset of 260 ms [10, as reported in 16]. The finding is consistent: proximity grouping is among the fastest forms of grouping, and shape similarity is slower.

**Attention.** Mack, Tang, Tuma, Kahn and Rock used an inattention paradigm: observers performed a demanding central task while a grouped pattern appeared in the background, and afterwards could not report what grouping had been there [13]. They concluded that grouping does not occur without attention. Ben-Av, Sagi and Braun found that identifying a grouping was severely impaired when it was a secondary task [12, as described in 16]. Moore and Egeth challenged the conclusion with an indirect measure [14]. Observers judged which of two lines was longer while background dots, grouped by colour similarity, formed Ponzo or Müller-Lyer configurations. Observers could not report the background patterns, yet their length judgements were biased by the illusions. Moore and Egeth concluded that grouping does occur without attention but that the result may not be encoded in memory [14]. Kimchi and Razpurker-Apfeld then showed that attentional demands differ by grouping type [15], and Rashal, Yeshurun and Kimchi found that grouping into rows or columns by proximity produced congruency effects under inattention, while grouping by shape similarity did not [16]. Their conclusion is that "attentional demands depend on the combination of grouping principles and the complexity of the processes involved" [16].

Healey's widely used visualisation reference explains why the word "preattentive" survives despite this: tasks completed in under 200 to 250 ms are conventionally called preattentive because eye movements take at least 200 ms to start, but "attention plays a critical role in what we see, even at this early stage of vision" [17].

**Summary.** Proximity grouping is fast (tens to low hundreds of milliseconds in lab displays) and, in the better-controlled recent work, appears to operate with little or no attention. The blanket claim that all Gestalt grouping is preattentive is contested and, for similarity of shape, contradicted [16].

## 3. Psychophysics: Weber's law and spacing

### 3.1 Weber's law and Fechner

Weber's law states that the just-noticeable difference (JND) in a stimulus is a constant fraction of its magnitude. Fechner built on Weber's experiments to propose that sensation grows with the logarithm of stimulus intensity [20]. Stevens later proposed a power law instead, and Teghtsoonian argued that the Stevens exponent for a continuum is predictable from its Weber fraction and dynamic range, with a near-constant "Ekman fraction" of about 0.03 across senses [18, as described in 20]. Lubashevsky notes that later analysis by Laming found the Ekman fraction varies more than Teghtsoonian claimed [20].

### 3.2 Weber fractions for length

The located values for visual line length are small:

- Wartzok and Ray, testing disc-size discrimination in a seal, compared their result with "the value of 0.029 reported for humans making visual line length discriminations" [19].
- Lubashevsky gives characteristic Weber fractions of 0.04 for visual length of lines, 0.08 for brightness and 0.1 for loudness, citing Baird and Noma's textbook, and a Stevens exponent of 1.0 for visual length [20].

So in a direct comparison of two lines, people can detect a difference of roughly 3 to 4 percent. The Stevens exponent of about 1.0 means perceived length grows roughly in proportion to physical length.

### 3.3 What this implies for spacing and type scales

Three implications follow, with different strength.

1. **Relative difference is the right unit.** Weber's law and the pure distance law (section 2.4) agree that the visual system works in ratios. A 4px change is 100 percent of 4px and 14 percent of 28px. This supports ratio-based spacing and type scales. (Finding, applied by analogy.)
2. **Detection thresholds are far below design steps.** A 14 percent difference (28px to 32px) is about four times the 3 to 4 percent threshold for line length. Even a 1.25 step (25 percent) is several JNDs. The reason to make steps larger is not that smaller ones are invisible, but that a design step must be recognised at a glance, in context, without side-by-side comparison, as a deliberate difference that means something. No located study measures that "categorical" threshold for gaps in a layout. (Analysis; the threshold the game uses is a studio rule.)
3. **Lab thresholds are best-case.** Weber fractions are measured with isolated lines, full attention and a forced choice. Gaps on a page are empty regions bounded by text of different shapes, often not aligned, and compared from memory across the page. Real-world discriminability is worse, by an amount no located study quantifies.

If Fechner's logarithmic law held exactly, equal ratios would produce equal perceived steps, which is the theoretical case for a geometric scale. With a Stevens exponent near 1.0 for length [20], perceived length is roughly proportional to physical length, so a geometric scale gives steps whose perceived ratio is also constant. Either way the argument for ratios holds. Neither law says which ratio to choose.

## 4. Visual hierarchy, salience and attention

### 4.1 Salience and visual search

Treisman and Gelade's feature-integration theory proposed that simple features such as colour and orientation are registered "early, automatically, and in parallel", while conjunctions of features require serial attention [22]. This is the origin of "pop-out": a single red item among green ones is found quickly regardless of how many green items there are. Itti and Koch's review of computational attention models lists five conclusions, of which two matter here: the salience of an item "critically depends on the surrounding context", and a single topographic saliency map is a plausible bottom-up control strategy [21]. Wolfe and Horowitz identify five factors that guide attention in search: bottom-up salience, top-down feature guidance, scene structure and meaning, the history of prior search, and the relative value of targets [24]. Wolfe's Guided Search 6.0 model formalises the same sources of guidance [23].

The design consequence is that emphasis is relative. A heading is salient because of its difference from what surrounds it, not because of its absolute size or weight. If every element is bold or large, none is salient. This is a direct inference from the context dependence of salience [21], and it underpins the game's "one dominant element" and "restraint with bold" rules, which remain studio rules because no located study tests them on web pages with thresholds.

### 4.2 Eye tracking on web pages

Nielsen's 2006 report from Nielsen Norman Group described the **F-shaped pattern**: two horizontal sweeps near the top of the content and a vertical scan down the left edge, observed in an eye-tracking study of 232 users viewing thousands of pages [25]. Pernice's 2017 update states that the pattern appears when text has little formatting for the web, users want to be efficient, and they are not committed to reading everything; it calls the pattern "bad for users and businesses" and says "good web formatting reduces the impact of F-scanning" [26]. Pernice's 2019 article ranks four text-scanning patterns. The **layer-cake pattern** "consists of fixations placed mostly on the page's headings and subheadings"; the **spotted pattern** fixates on words that stand out visually (links, bold, coloured words) or match the reader's task; the **commitment pattern** is full reading [27].

Two points matter for the game. Headings that are visually distinct from body text enable the layer-cake pattern, which is the efficient one [27]. And bold words attract fixations in the spotted pattern [27], so bold used for decoration pulls fixations away from content. These are practitioner research reports (Practice with empirical observation): the methods are eye tracking with commercial samples, published without peer review, and effect sizes are not reported in the located pages.

Djamasbi, Siegel and Tullis ran a survey and an eye-tracking study with Generation Y participants and found that pages preferred by this group included a main large image, images of celebrities, little text and a search feature [28]. The finding is age-cohort specific and should not be generalised.

### 4.3 First impressions and complexity

Lindgaard, Fernandes, Dudek and Brown ran three studies on how quickly people form an opinion of a page's visual appeal. Ratings after 50 ms of exposure correlated highly with ratings after 500 ms [29]. Tuch and colleagues summarise the reported correlations as r = .97 between repeated 500 ms ratings, r = .98 between 500 ms and unlimited viewing, and r = .97 between 50 ms and 500 ms [30].

Tuch, Presslaber, Stöcklin, Opwis and Bargas-Avila manipulated visual complexity (low, medium, high) and prototypicality (low, high) in screenshots of real websites [30]. In Study 1 (n = 59, presentation times 50, 500 or 1000 ms between subjects), both factors affected beauty ratings with large effects (complexity: F(1.8, 99.9) = 77.6, partial η² = .58; prototypicality: F(1.0, 56.0) = 241.4, partial η² = .81), and there was a strong interaction (partial η² = .60): prototypicality mattered much more for low and medium complexity pages (Cohen's d = 1.96 and 1.79) than for high complexity ones (d = .24) [30]. Study 2 found effects of complexity at exposures as short as 17 ms. Low complexity and high prototypicality pages were rated most appealing [30].

Reinecke and colleagues collected ratings of 450 websites from 548 volunteers and built computational models of perceived colourfulness and visual complexity. With demographic variables, the models explained 48 percent of the variance in appeal ratings made after 500 ms [31]. High complexity produced the largest drop in appeal, while low-complexity sites were liked about as much as medium ones; colourfulness played "only a minor role"; and preferences varied by age and education [31].

**Implication.** Clutter (high visual complexity) reduces first-impression appeal within a fraction of a second, and conventional layouts help. This is a Finding with large effect sizes in lab and online samples. It supports the general direction of the game's lessons (group, simplify, use conventions) but does not supply any specific threshold.

## 5. Typography

### 5.1 Modular scales (Practice)

Tim Brown's "More meaningful typography" defines a modular scale as "a sequence of numbers that relate to one another in a meaningful way" and demonstrates a golden-ratio scale applied to type sizes, line height, measure and margins [32]. Brown is explicit that the method is aesthetic and iterative: he reports trial and error and choosing values that looked good, and calls modular scales "a tool, they're not magic" [32]. The Modular Scale calculator by Kellum and Brown lists ratios named after musical intervals, including minor third 1.2, major third 1.25, perfect fourth 1.333, perfect fifth 1.5, golden section 1.618 and octave 2 [33]. The musical names are an analogy; no located study shows that ratios consonant in sound look harmonious in type. Every Layout presents the same idea for CSS custom properties and states that "it is in the strict adherence to whichever ratio you choose that harmony is created" [62].

### 5.2 Measure

Bringhurst's guidance, as quoted by Rutter: "Anything from 45 to 75 characters is widely regarded as satisfactory. The 66-character line is ideal. For multiple columns, 40 to 50 characters is better" [34]. This is Practice: a typographer's distillation of print tradition.

The screen-reading research is mixed and does not straightforwardly support 45 to 75:

- Dyson's 2004 review concluded that characters per line is the critical variable, that most studies report faster reading with longer lines, and that readers' preferences do not match their performance [36]. In Dyson and Kipping's study described there (48 participants, 25 to 100 characters per line, 10 pt Arial with 12 pt leading), the longest line (100 characters) was read fastest, but a medium line of 55 characters was rated easiest to read [36].
- Dyson and Haselgrove found better comprehension at 55 characters per line than at 100, with no speed-accuracy trade-off [35, as described in 36].
- Ling and van Schaik (Experiment 1, n = 72; 55, 70, 85 and 100 characters per line) found visual search fastest at 85 and 100 characters per line, while shorter lines produced better subjective ratings in both experiments [37].
- WCAG 2.x Success Criterion 1.4.8 (Level AAA) requires a mechanism for blocks of text to be no more than 80 characters wide (40 for CJK) [45].

The defensible summary is: very long lines (around 100 characters and above) can be read or scanned faster on screen but are liked less and, in one study, understood less; moderate lines around 55 to 75 characters are preferred and comprehended at least as well. A 45 to 75 range is Practice, consistent with the comprehension and preference data, and inside the WCAG AAA ceiling.

### 5.3 Leading

- WCAG 2.x SC 1.4.12 Text Spacing (AA) does not require authors to set leading of 1.5. It requires that no content or function is lost when a user overrides line height to at least 1.5 times the font size, paragraph spacing to 2 times, letter spacing to 0.12 times and word spacing to 0.16 times [44]. The Understanding document attributes its spacing metrics to an analysis of a study by McLeish on letter spacing [44].
- SC 1.4.8 (AAA) requires a mechanism to achieve line spacing of at least space-and-a-half within paragraphs and paragraph spacing 1.5 times the line spacing, motivated by people with some cognitive disabilities who find tightly spaced lines hard to track [45].
- Rello, Pielot and Marcos ran an eye-tracking study with 104 participants reading Wikipedia articles, varying font size from 10 to 26 points and line spacing from 0.8 to 1.8 [38]. Readability (mean fixation duration) improved significantly with font size, and comprehension was better at 18 and 26 points. Line spacing had only marginal effects: the two extremes (0.8 and 1.8) impaired readability, and the authors recommend default line spacing [38].
- Older screen studies described by Dyson found double spacing marginally better than single (Kolers and colleagues) and single spacing slower than double (Kruk and Muter), with confounds about lines per screen [36].
- Chaparro and colleagues found that leading did not affect reading performance but did affect preference (section 8) [58].
- Butterick recommends line spacing of 120 to 145 percent of the point size (Practice) [41].

So: leading has small measured effects on performance within a normal range, extremes hurt, and readers prefer some openness. A band of 1.4 to 1.7 sits slightly above Butterick's range, includes the WCAG 1.5 reference value and stays below the 1.8 extreme that Rello and colleagues found impairing. It is a defensible Studio rule, not a finding.

### 5.4 Type size

Legge and Bigelow review vision science and typography and define the **fluent range** of print size, over which reading speed is at its maximum: x-heights from about 0.2° to 2° of visual angle, which at 40 cm corresponds to x-heights of 1.4 mm (4 points) to 14 mm (40 points) [39]. Typical publications fall inside this range [39]. Rello and colleagues' larger web sizes (18 points and up) improved fixation measures and comprehension [38]. Bernard, Liao and Mills found that older adults (mean age 70) judged 14-point text more legible than 12-point and preferred it [40]. Butterick's practice range for the web is 15 to 25 pixels [41].

### 5.5 Bold, emphasis and number of families

Butterick: "Use bold or italic as little as possible, and not together" [41]. The NN/g spotted pattern shows that bold words attract fixations [27], which supports restraint: emphasis spent on decoration is emphasis taken from content. No located experiment measures how much bold is too much.

No located study tests a limit on the number of typeface families. The "at most two families" rule is Practice at best and should be labelled a Studio rule. Ling and van Schaik found little effect of font (Arial versus Times) on task performance [37], and Bernard and colleagues found no significant typeface effect in older adults [40], which suggests that family choice matters less to performance than size and measure.

## 6. Colour

### 6.1 The WCAG 2.x contrast ratio (Standard)

WCAG defines relative luminance for sRGB as L = 0.2126 R + 0.7152 G + 0.0722 B, where each channel is linearised (divide by 12.92 if the sRGB value is at most 0.04045, otherwise ((v + 0.055)/1.055)^2.4) [43]. The contrast ratio is (L1 + 0.05)/(L2 + 0.05), with L1 the lighter colour. SC 1.4.3 (AA) requires 4.5:1 for text and 3:1 for large-scale text, defined as at least 18 point, or 14 point bold [42]. SC 1.4.6 (AAA) raises the requirement to 7:1, aimed at vision of about 20/80 [42].

The rationale given by W3C is short. ISO-9241-3 and ANSI-HFES-100-1988 recommend 3:1 for standard text and vision. Citing Arditi and Faye, the Understanding document states that "visual acuity of 20/40 is associated with a contrast sensitivity loss of roughly 1.5", so a reader with 20/40 vision needs 3 × 1.5 = 4.5:1 [42]. The 4.5 figure is therefore a derived engineering threshold, not the result of a reading-speed experiment. The Understanding document also states that specifying a text colour without a background colour is a failure, because the user's default background is unknown [42]. This supports the game's choice to measure contrast against the effective (composited) background rather than the nearest declared one.

### 6.2 Critiques and APCA

The Accessible Perceptual Contrast Algorithm (APCA), by Andrew Somers of Myndex Research, reports a lightness contrast value Lc that depends on polarity (dark on light differs from light on dark) [48]. Its documentation recommends Lc 75 as a minimum for body text and Lc 90 as preferred, Lc 45 for large text (over about 36px), with different values for other uses of text [48]. The APCA documentation argues that WCAG 2 contrast "fails most with dark colors" and gives "relatively meaningless" results for dark mode [48]. These are claims from APCA's author; the review did not locate an independent peer-reviewed comparison of the two methods.

APCA's status matters for the game. Its own documentation describes it as the candidate method for WCAG 3 [48]. Roselli reports that APCA was removed from the WCAG 3 working draft in July 2023 as exploratory content without working group support, that the April 2026 editor's draft states "the contrast algorithm used in WCAG 3 is yet to be determined", and that WCAG 3 is years from completion [49]. Roselli's piece is a practitioner's commentary, not a W3C document. The safe position for the game is to grade against WCAG 2.x (the current standard) and mention APCA, if at all, as a proposed alternative.

### 6.3 Perceptual colour spaces: CIELAB, CAM16, OKLab and OKLCH

Ottosson published Oklab on 23 December 2020 as "A perceptual color space for image processing" [50]. It keeps the simple structure of IPT, with a cube-root nonlinearity, and was fitted to lightness and chroma data generated with CAM16 and to Ebner-Fairchild hue uniformity data [50]. Ottosson's comparisons show CIELAB predicts hue poorly for blues and gives "clear differences in lightness for different hues" (yellow, magenta and cyan appear lighter than red and blue at equal CIELAB lightness), while Oklab performs comparably to CAM16-UCS on lightness and chroma and avoids CAM16's compression of chroma in blends [50]. CAM16 itself is the colour appearance model and uniform colour space proposed by Li and colleagues to replace CIECAM02 [52]. OKLab and its cylindrical form OKLCH (OKLCH lightness, chroma and hue) are specified in CSS Color Module Level 4 [51].

Two clarifications matter for teaching. Oklab is designed for "normal well lit viewing conditions" with a D65 white [50]; it is an approximation built for simplicity, not a full appearance model. And an OKLCH lightness step does not set a WCAG contrast ratio. WCAG uses relative luminance; OKLCH lightness is a nonlinear transform that also depends on chroma and hue for chromatic colours. Two colours with the same OKLCH lightness will be close in luminance, which is why OKLCH palettes are convenient for contrast work, but the game must still compute the contrast ratio from the computed values (analysis based on [43, 50]).

### 6.4 Colour vision deficiency and "not by colour alone"

Birch's review of population surveys reports red-green colour deficiency in about 8 percent of men and 0.4 percent of women of European Caucasian descent, and between 4 and 6.5 percent of men of Chinese and Japanese ethnicity [53]. WCAG SC 1.4.1 (A) requires that colour is not "the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element" [46]. The Understanding document's example is a required form field marked by both red text and an icon [46]. For links in body text, Technique G183 allows colour-only links if the link text has a 3:1 contrast ratio against the surrounding text and an additional cue (such as an underline) appears on hover and focus; for blocks of text without many links, underlines are recommended [47].

## 7. Alignment, balance and grids

### 7.1 Good continuation and alignment

Good continuation (elements on a smooth line or curve group together) is one of the classical principles and is the basis of contour integration research reviewed by Wagemans and colleagues [2]. Alignment of edges in a layout is an application of good continuation: elements whose left edges fall on one vertical line form an implied contour. The review did not locate an experiment that measures how the number of distinct left edges on a page affects reading or appeal.

### 7.2 Computational aesthetics

Ngo, Teo and Byrne proposed 14 aesthetic measures for screen layouts, computed from the positions and sizes of objects, and reported an empirical study suggesting these measures relate to viewers' judgements [54]. Bauerly and Liu built computational models of compositional properties of interfaces, such as symmetry and balance, and tested their effects on aesthetic ratings experimentally [55]. The located records for both papers did not include their full results, so this review does not report specific effects. They establish that layout regularity can be measured from element geometry, which is what the game's alignment checks do, but they do not supply thresholds such as "at most three left edges".

### 7.3 Grids (Practice)

Müller-Brockmann's *Grid Systems in Graphic Design* (Niggli, 1981) gives rules for grids from 8 to 32 fields and is the classic practice text [56]. Material Design specifies that components align to an 8dp square baseline grid and that type and toolbar icons align to a 4dp grid [64]. IBM's Carbon design system builds its spacing tokens on multiples of 2, 4 and 8 (base 8px) [65]. These are conventions that make layouts consistent and easy to implement; no located study compares grid systems for reading or comprehension.

### 7.4 Optical alignment and overshoot

Type designers make round and pointed letters extend slightly beyond the baseline and cap height or x-height so that they look the same size as flat letters. A secondary reference gives 1 to 3 percent of the cap or x-height as typical for "O", and attributes to Peter Karow a recommendation of 3 percent for O and 5 percent for A [57]. This is Practice grounded in a well-known perceptual effect (round shapes look smaller than squares of the same height). The same reasoning justifies optical alignment in layouts, such as hanging punctuation or nudging an icon so it looks centred. The game can teach the principle; the percentages are type-design practice and not a layout threshold.

## 8. Whitespace research

**Chaparro and colleagues (2004).** Published in *Usability News* by the Software Usability Research Laboratory (SURL) at Wichita State University, this study manipulated margins around text and leading to create four whitespace layouts [58]. The abstract reports that margins "affected both reading speed and comprehension more than the No Margin text", that participants were more satisfied with margins, and that leading did not affect reading performance but did influence preference [58]. The located record did not include sample size or effect sizes. This is the study practitioners usually mean by "the Wichita whitespace study". It supports margins around a text block. It does not support claims about whitespace between page sections or about specific ratios.

**Coursaris and Kripintris (2012).** A between-subjects study built three versions of an e-commerce site with 25, 50 and 75 percent whitespace [60]. The authors report that aesthetics related to perceived usability, and that perceived usability fell when whitespace exceeded 50 percent [60]. More whitespace is not always better: past a point, content shrinks and usability suffers.

**Lin (2004): flag.** Practitioner articles often state that whitespace between paragraphs and in the margins "increases comprehension by almost 20%", citing Lin (2004) in *Computers in Human Behavior*. The Lin paper located in that journal for 2004 is "Evaluating older adults' retention in hypertext perusal: impacts of presentation media as a function of text topology" [59]. Its abstract describes 24 older participants and manipulations of presentation media (animated graphs, static pictures, pure text) and text topology; it does not describe a whitespace manipulation [59]. The 20 percent figure could not be traced to this paper and should not be used in the game.

**Complexity studies.** The first-impression studies in section 4.3 provide indirect support: high visual complexity lowers appeal [30, 31], and whitespace is one way of lowering complexity. But Reinecke and colleagues found low-complexity sites were liked no more than medium ones [31], which matches Coursaris and Kripintris: whitespace helps until the page starts to look empty or the content becomes hard to find.

## 9. Practice sources

These sources are Practice. They are valuable as statements of current craft, and the game's token system follows them, but none presents experimental evidence for its numbers.

- **Refactoring UI** (Wathan and Schoger) has chapters titled "Start with too much white space", "Establish a spacing and sizing system", "De-emphasize to emphasize" and "Establish a type scale" [61]. Secondary summaries attribute to it a spacing scale (4, 8, 12, 16, 24, 32, 48, 64 and so on) and a rule that adjacent values should sit at least about 25 percent apart; these details were not checked against the book text.
- **Every Layout** (Pickering and Bell) derives spacing and type sizes from one ratio custom property and argues that strict adherence to the chosen ratio matters more than which ratio it is [62].
- **Utopia** (Gilyead and Mudford, with Clearleft) interpolates type and space scales between a small and a large viewport using CSS `clamp()`, so values change fluidly instead of at breakpoints. Its default configuration uses a type scale ratio of 1.2 at 360px rising to 1.25 at 1240px [63].
- **Material Design** uses an 8dp grid for components and 4dp for type and icons [64]. This is a linear (additive) system, not a ratio scale.
- **IBM Carbon** has 13 spacing tokens from 2px to 160px built on multiples of 2, 4 and 8 [65]. The step ratios vary: 2px to 4px is 2×, 8px to 12px is 1.5×, 12px to 16px is 1.33×, 32px to 40px is 1.25×.
- **Butterick's Practical Typography**: body text 15 to 25 pixels on the web, line spacing 120 to 145 percent, line length 45 to 90 characters, bold and italic used as little as possible [41].
- **Bringhurst**, via Rutter: measure 45 to 75 characters, 66 ideal [34].
- **Brown** and the Modular Scale calculator: ratio scales named after musical intervals [32, 33].

The spread matters for the game. Design systems use ratios between about 1.2 and 2 per step, and some use linear increments. A scale "about 1.5× per step" is one reasonable choice within this practice, not a perceptual law.

## 10. Claims audit

This section checks the four claims named in the brief against the evidence, plus two related statements found in the Level 1 content.

### Claim 1: "Proximity grouping is pre-attentive, happening in the first fraction of a second."

**Verdict: partly supported; the word "pre-attentive" is contested.** The speed half is supported. Proximity grouping appears with masks at an SOA of 60 ms [11, 16] and in brain responses at 100 to 120 ms [10, 16], earlier than grouping by shape similarity. The attention half is disputed. Mack and colleagues found people could not report groupings they had not attended [13]; Moore and Egeth [14] and Rashal and colleagues [16] found indirect evidence that grouping, including proximity grouping into rows and columns, still shapes responses without attention. Healey notes the term "preattentive" persists for speed, though attention plays a role even early in vision [17]. The current consensus is that attentional demands differ between grouping principles [15, 16].

**Accurate phrasing:** "Grouping by proximity is fast. In lab tests it shows up within about a tenth of a second, sooner than grouping by shape, and some experiments find it shapes what people do even when their attention is elsewhere."

### Claim 2: "Weber's law: 28px vs 32px looks the same."

**Verdict: the law is right, the example is wrong.** Weber's law holds for length, and the principle of relative difference is sound. But 28px to 32px is a 14 percent difference, while measured Weber fractions for line length are about 3 to 4 percent [19, 20]. Placed side by side, the two are distinguishable. The defensible point is weaker: a 4px difference between two gaps is easy to miss when they are far apart on a page and surrounded by other content, and it does not read as a deliberate step. No located study measures that in-context threshold.

**Accurate phrasing:** "We judge size by proportion, not pixels. 28px and 32px differ by 14 percent: you can see it if you compare them directly, but across a busy page it does not read as a deliberate step. Make steps big enough that nobody has to compare."

### Claim 3: "2× between/within is about the limit of what people notice."

**Verdict: not supported; the evidence points the other way.** In dot lattices shown for 300 ms, once one distance is about 1.5 times the other, grouping along the longer distance is "almost never seen" [2, 7]. Oyama's viewing-time data imply a strong preference at ratios well below 2 [2]. People therefore notice, and group by, gap ratios much smaller than 2. A 2× ratio is a margin of safety for real pages, where elements have size, edges and competing cues such as colour and borders [8]. Wertheimer's own demonstration used 4:1 [1].

**Accurate phrasing:** "In lab dot patterns, people group by the smaller gap almost every time once the larger gap is about one and a half times the smaller. Real pages have more going on, so the studio rule asks for twice: the gap between groups should be at least 2× the largest gap inside them." Label the 2× value a studio rule.

### Claim 4: "Each spacing step ~1.5× the last."

**Verdict: practice, not research.** No located study supports a specific ratio for spacing scales. Practice varies: Refactoring UI is reported to ask for at least 25 percent between steps [61]; Carbon's steps range from 1.25× to 2× [65]; Material uses linear 8dp increments [64]; Utopia's type defaults are 1.2 to 1.25 [63]. Any ratio from about 1.25 upwards produces steps that are many JNDs apart [19, 20]. A ratio of about 1.5 is a reasonable choice but not a perceptual requirement.

**Accurate phrasing:** "Studio rule: make each spacing step about 1.5× the last, so no two steps are close enough to confuse. Published design systems use ratios between about 1.25 and 2."

### Related statement A: "14 or 16px is within perceptual noise of 12px." (Level 1 content)

**Verdict: false as stated.** 14px is 17 percent larger than 12px and 16px is 33 percent larger, both several times the Weber fraction for length [19, 20]. **Accurate phrasing:** "14px or 16px next to 12px is a visible difference but too small to read as 'a different group'. The studio rule asks for 2×."

### Related statement B: "A ratio scale ... so every step looks as different from the last as every other step does." (Level 1 lesson)

**Verdict: theory-consistent, untested in layouts.** If perceived difference follows Weber's law, equal ratios give equal perceived steps; with a Stevens exponent of about 1.0 for length [20] the conclusion holds approximately. No located study tests it for spacing on a page. **Accurate phrasing:** "Because we judge size by proportion, a scale where each step is the same multiple of the last gives steps that look evenly spaced."

## 11. Implications for Design Quest

Each threshold below is labelled **Research-backed** (a finding directly supports the threshold or its direction), **Standard-backed** (WCAG) or **Studio rule** (chosen by the studio; may cite supporting research or practice, but the number itself is not a finding). Lesson copy should present studio rules as rules ("our studio uses 2×"), not as facts about perception.

1. **Level 1, proximity (between-group gap at least 2× the largest within-group gap): Studio rule, research-informed.** The direction (between larger than within) and the use of a ratio are research-backed [1, 2, 7]. The 2× value is a safety margin above the lattice threshold of about 1.5 [2]. The check should compare ratios, not pixel differences, because grouping is scale-invariant over a reasonable range [2]. Treat filled or bordered containers as a separate cue, since common region and connectedness can override proximity [4, 5].
2. **Level 1, ratio spacing scale (about 1.5× per step; merge values within 25 percent): Studio rule.** Supported in direction by Weber's law [19, 20]; the specific ratio and the 25 percent merge rule are practice [61, 65]. Replace the "28 vs 32 looks the same" and "within perceptual noise" copy (section 10).
3. **Level 1, three tiers of space and inner padding not exceeding outer gap: Studio rule.** The inner-not-exceeding-outer rule follows from proximity [1, 7]: if card padding exceeds the gap between cards, content sits nearer its neighbour's edge than its own. Carbon's split between component spacing and larger layout increments is a practice precedent [65].
4. **Level 1, spacing from design tokens (`--space-*` custom properties): Studio rule (Practice).** Consistency is the argument [62, 64, 65]; no experiment is needed or claimed.
5. **Level 1, lesson copy on speed: Research-backed with corrected wording.** Use the phrasing in section 10, Claim 1.
6. **Level 2, heading size ratio at least 1.2× between levels: Studio rule.** A 20 percent size difference is far above the detection threshold [19, 20], and 1.2 matches the minor-third ratio [33] and Utopia's small-screen default [63]. No study fixes the ratio needed for hierarchy to be read correctly.
7. **Level 2, one dominant element: Studio rule, research-informed.** Salience depends on context [21], and eye-tracking reports show distinct headings support efficient layer-cake scanning [27]. "Exactly one" is a design convention.
8. **Level 2, restraint with bold: Studio rule (Practice).** Bold attracts fixations in the spotted pattern [27], and Butterick advises minimal use [41]. The numeric limit the game sets is a studio choice.
9. **Level 2, de-emphasis through colour and size: Studio rule (Practice) with a Standard constraint.** The technique is practice [61]. De-emphasised text must still meet 4.5:1 against its effective background [42]; the game should run the contrast check on secondary text, where failures cluster.
10. **Level 2, fluid type with `clamp()`: Studio rule (Practice).** Utopia is the method's reference [63]. Legge and Bigelow's fluent range [39] supports keeping body text comfortably large at every viewport, and Rello and colleagues' results favour larger body sizes on text-heavy pages [38].
11. **Level 3, contrast ratio at least 4.5:1 (3:1 for large text) against the effective background: Standard-backed.** WCAG SC 1.4.3 [42], with the formula in [43]. Lesson copy should state the origin accurately: 3:1 from ISO-9241-3, multiplied by 1.5 for 20/40 vision [42]. If APCA is mentioned, say it is a proposed method not currently in the WCAG 3 draft [48, 49].
12. **Level 3, state not shown by colour alone: Standard-backed.** WCAG SC 1.4.1 [46] and Technique G183 for links [47]. The prevalence figure (about 8 percent of men of European descent) is a Finding [53]; avoid generalising it to "8 percent of people".
13. **Level 3, OKLCH palettes: Studio rule (Practice) with a supporting rationale.** OKLCH comes from Ottosson's Oklab [50] and is part of CSS Color 4 [51]. Teach that OKLCH lightness tracks perceived lightness better than HSL or CIELAB across hues [50], and that the contrast check still uses WCAG relative luminance [43].
14. **Level 4, measure 45 to 75 characters: Studio rule (Practice) with mixed research.** Bringhurst's range [34]; comprehension and preference favour moderate lines [35, 36, 37]; speed sometimes favours longer lines [36, 37]; WCAG AAA ceiling 80 [45]. Copy must not claim that 66 characters is proven optimal.
15. **Level 4, leading 1.4 to 1.7: Studio rule.** Above Butterick's 1.2 to 1.45 [41], includes WCAG's 1.5 reference value [44, 45], below the 1.8 extreme that impaired readability [38]. Measured performance effects of leading within a normal range are small [36, 38, 58].
16. **Level 4, at most two type families: Studio rule.** No located study supports a family limit; family choice had little effect on performance in the located studies [37, 40].
17. **Level 5, similarity, common region, continuity and closure: Research-backed principles, studio thresholds.** The principles are established [1, 2, 5]. Grouping cues add up [8], and similarity of shape is slower and more attention-dependent than proximity [16]; lessons can teach that shape alone is a weak grouping cue compared with colour, proximity or a shared container. Any numeric check (for example colour difference between groups) is a studio rule.
18. **Level 6, few distinct left edges: Studio rule, research-informed.** Good continuation [2] and computational aesthetics measures [54, 55] support regular alignment; no located study gives a maximum number of edges.
19. **Level 6, optical alignment: Practice.** Overshoot in type design (1 to 3 percent for round letters) is the canonical example [57]. Teach the principle; do not present the percentages as layout rules.
20. **Level 7, columns and gutters: Studio rule (Practice).** Müller-Brockmann [56], Material's 8dp grid [64] and Carbon's tokens [65] are conventions. One research-derived constraint applies: gutters between columns must be larger than the gaps inside a column's content, by the same proximity logic as Level 1 [2, 7].
21. **Level 8, final page: combined checks.** Copy should reuse the labels from earlier levels. The first-impression research [29, 30, 31] can frame the brief (visitors judge appeal within a fraction of a second, and clutter lowers it) as a Finding, provided the copy does not claim that any single rule produces that judgement.

## 12. Sources from the brief not verified or not used

- **Arditi and Faye** (the contrast sensitivity source cited by WCAG): cited inside the WCAG Understanding document [42] but the original was not located; its content is reported only through WCAG.
- **ISO-9241-3 and ANSI-HFES-100-1988**: reported only through WCAG [42].
- **Bringhurst, *The Elements of Typographic Style***: the book itself was not retrieved; the measure figures are quoted via Rutter [34].
- **Fechner, *Elemente der Psychophysik* (1860)**: not retrieved; described through [20].
- **Baird and Noma, *Fundamentals of Scaling and Psychophysics***: the 0.04 Weber fraction for line length is reported via [20].
- **Oyama (1961)**: reported via the Wagemans review [2].
- **Lin (2004) whitespace claim**: the cited paper was located but does not appear to contain the claim (section 8).
- **Refactoring UI's specific spacing values and 25 percent rule**: only chapter titles were verified on the authors' site [61].
- **Full results of Ngo, Teo and Byrne (2003) and Bauerly and Liu (2006)**: bibliographic records verified; findings not retrieved.
- **A peer-reviewed independent comparison of WCAG 2 contrast and APCA**: not located.
- **CIELAB (CIE 1976) primary documentation**: not retrieved; CIELAB is discussed only through Ottosson's comparisons [50].

## References

1. Wertheimer, M. (1938). Laws of organization in perceptual forms. In W. Ellis (Ed.), *A source book of Gestalt psychology* (pp. 71–88). Routledge & Kegan Paul. Originally published 1923 as Untersuchungen zur Lehre von der Gestalt II, *Psychologische Forschung*, 4, 301–350. https://psychclassics.yorku.ca/Wertheimer/Forms/forms.htm
2. Wagemans, J., Elder, J. H., Kubovy, M., Palmer, S. E., Peterson, M. A., Singh, M., & von der Heydt, R. (2012). A century of Gestalt psychology in visual perception: I. Perceptual grouping and figure–ground organization. *Psychological Bulletin*, 138(6), 1172–1217. https://doi.org/10.1037/a0029333
3. Wagemans, J., Feldman, J., Gepshtein, S., Kimchi, R., Pomerantz, J., van der Helm, P., & van Leeuwen, C. (2012). A century of Gestalt psychology in visual perception: II. Conceptual and theoretical foundations. *Psychological Bulletin*, 138(6), 1218–1252. https://doi.org/10.1037/a0029334
4. Palmer, S. E., & Rock, I. (1994). Rethinking perceptual organization: The role of uniform connectedness. *Psychonomic Bulletin & Review*, 1, 29–55. https://doi.org/10.3758/BF03200760
5. Palmer, S. E. (1992). Common region: A new principle of perceptual grouping. *Cognitive Psychology*, 24, 436–447. https://doi.org/10.1016/0010-0285(92)90014-S
6. Kubovy, M., & Wagemans, J. (1995). Grouping by proximity and multistability in dot lattices: A quantitative Gestalt theory. *Psychological Science*, 6(4), 225–234. https://doi.org/10.1111/j.1467-9280.1995.tb00597.x
7. Kubovy, M., Holcombe, A. O., & Wagemans, J. (1998). On the lawfulness of grouping by proximity. *Cognitive Psychology*, 35, 71–98. https://doi.org/10.1006/cogp.1997.0673
8. Kubovy, M., & van den Berg, M. (2008). The whole is equal to the sum of its parts: A probabilistic model of grouping by proximity and similarity in regular patterns. *Psychological Review*, 115(1), 131–154. https://doi.org/10.1037/0033-295X.115.1.131
9. Han, S., Humphreys, G. W., & Chen, L. (1999). Uniform connectedness and classical Gestalt principles of perceptual grouping. *Perception & Psychophysics*, 61, 661–674. https://doi.org/10.3758/BF03205537
10. Han, S., Song, Y., Ding, Y., Yund, E. W., & Woods, D. L. (2001). Neural substrates for visual perceptual grouping in humans. *Psychophysiology*, 38, 926–935. https://doi.org/10.1111/1469-8986.3860926
11. Ben-Av, M. B., & Sagi, D. (1995). Perceptual grouping by similarity and proximity: Experimental results can be predicted by intensity autocorrelations. *Vision Research*, 35(6), 853–866. https://doi.org/10.1016/0042-6989(94)00173-J
12. Ben-Av, M. B., Sagi, D., & Braun, J. (1992). Visual attention and perceptual grouping. *Perception & Psychophysics*, 52, 277–294. https://doi.org/10.3758/BF03209145
13. Mack, A., Tang, B., Tuma, R., Kahn, S., & Rock, I. (1992). Perceptual organization and attention. *Cognitive Psychology*, 24(4), 475–501. https://doi.org/10.1016/0010-0285(92)90016-U
14. Moore, C., & Egeth, H. (1997). Perception without attention: Evidence of grouping under conditions of inattention. *Journal of Experimental Psychology: Human Perception and Performance*, 23(2), 339–352. https://doi.org/10.1037/0096-1523.23.2.339
15. Kimchi, R., & Razpurker-Apfeld, I. (2004). Perceptual grouping and attention: Not all groupings are equal. *Psychonomic Bulletin & Review*, 11(4), 687–696. https://doi.org/10.3758/BF03196621
16. Rashal, E., Yeshurun, Y., & Kimchi, R. (2017). Attentional requirements in perceptual grouping depend on the processes involved in the organization. *Attention, Perception, & Psychophysics*, 79, 2073–2087. https://doi.org/10.3758/s13414-017-1365-y
17. Healey, C. G. (n.d.). [Web page on preattentive processing in visualisation]. North Carolina State University. https://www.csc2.ncsu.edu/faculty/healey/PP/
18. Teghtsoonian, R. (1971). On the exponents in Stevens' law and the constant in Ekman's law. *Psychological Review*, 78, 71–80. https://doi.org/10.1037/h0030300
19. Wartzok, D., & Ray, G. C. (1976). A verification of Weber's law for visual discrimination of disc sizes in the Bering Sea spotted seal, *Phoca largha*. *Vision Research*, 16(8), 819–822. https://doi.org/10.1016/0042-6989(76)90141-3
20. Lubashevsky, I. (2018). Psychophysical laws as reflection of mental space properties. arXiv:1806.11077. https://arxiv.org/abs/1806.11077
21. Itti, L., & Koch, C. (2001). Computational modelling of visual attention. *Nature Reviews Neuroscience*, 2(3), 194–203. https://doi.org/10.1038/35058500
22. Treisman, A. M., & Gelade, G. (1980). A feature-integration theory of attention. *Cognitive Psychology*, 12, 97–136. https://www.cs.princeton.edu/courses/archive/spring08/cos598B/Readings/TreismanGelade1980.pdf
23. Wolfe, J. M. (2021). Guided Search 6.0: An updated model of visual search. *Psychonomic Bulletin & Review*, 28, 1060–1092. https://doi.org/10.3758/s13423-020-01859-9
24. Wolfe, J. M., & Horowitz, T. S. (2017). Five factors that guide attention in visual search. *Nature Human Behaviour*, 1, 0058. https://doi.org/10.1038/s41562-017-0058
25. Nielsen, J. (2006, April 16). F-shaped pattern for reading web content. Nielsen Norman Group. https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content-discovered/
26. Pernice, K. (2017, November 12). [Article revisiting the F-shaped reading pattern]. Nielsen Norman Group. https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
27. Pernice, K. (2019, August 25). [Article on text scanning patterns from eyetracking]. Nielsen Norman Group. https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/
28. Djamasbi, S., Siegel, M., & Tullis, T. (2010). Generation Y, web design, and eye tracking. *International Journal of Human-Computer Studies*, 68, 307–323. https://doi.org/10.1016/j.ijhcs.2009.12.006
29. Lindgaard, G., Fernandes, G., Dudek, C., & Brown, J. (2006). Attention web designers: You have 50 milliseconds to make a good first impression! *Behaviour & Information Technology*, 25(2), 115–126. https://doi.org/10.1080/01449290500330448
30. Tuch, A., Presslaber, E., Stöcklin, M., Opwis, K., & Bargas-Avila, J. (2012). The role of visual complexity and prototypicality regarding first impression of websites: Working towards understanding aesthetic judgments. *International Journal of Human-Computer Studies*, 70(11), 794–811. https://doi.org/10.1016/j.ijhcs.2012.06.003
31. Reinecke, K., Yeh, T., Miratrix, L., Mardiko, R., Zhao, Y., Liu, J., & Gajos, K. Z. (2013). Predicting users' first impressions of website aesthetics with a quantification of perceived visual complexity and colorfulness. *Proceedings of CHI 2013*, 2049–2058. https://doi.org/10.1145/2470654.2481281
32. Brown, T. (2011, May 3). More meaningful typography. *A List Apart*. https://alistapart.com/article/more-meaningful-typography/
33. Kellum, S., & Brown, T. (n.d.). Modular Scale [web calculator]. https://www.modularscale.com/
34. Rutter, R. (n.d.). 2.1.2 Choose a comfortable measure. In *The Elements of Typographic Style Applied to the Web* (quoting R. Bringhurst, *The Elements of Typographic Style*). https://webtypography.net/2.1.2
35. Dyson, M. C., & Haselgrove, M. (2001). The influence of reading speed and line length on the effectiveness of reading from screen. *International Journal of Human-Computer Studies*, 54, 585–612. https://doi.org/10.1006/ijhc.2001.0458
36. Dyson, M. C. (2004). How physical text layout affects reading from screen. *Behaviour & Information Technology*, 23(6), 377–393. https://doi.org/10.1080/01449290410001715714
37. Ling, J., & van Schaik, P. (2006). The influence of font type and line length on visual search and information retrieval in web pages. *International Journal of Human-Computer Studies*, 64(5), 395–404. https://doi.org/10.1016/j.ijhcs.2005.08.015
38. Rello, L., Pielot, M., & Marcos, M.-C. (2016). Make it big! The effect of font size and line spacing on online readability. *Proceedings of CHI 2016*, 3637–3648. https://doi.org/10.1145/2858036.2858204
39. Legge, G. E., & Bigelow, C. A. (2011). Does print size matter for reading? A review of findings from vision science and typography. *Journal of Vision*, 11(5):8, 1–22. https://doi.org/10.1167/11.5.8
40. Bernard, M., Liao, C., & Mills, M. (2001). Examining perceptions of online text size and typeface legibility for older males and females. *Proceedings of the 6th Annual International Conference on Industrial Engineering: Theory, Applications, and Practice*. https://portfolio.erau.edu/en/publications/examining-perceptions-of-online-text-size-and-typeface-legibility/
41. Butterick, M. (n.d.). Summary of key rules. *Butterick's Practical Typography*. https://practicaltypography.com/summary-of-key-rules.html
42. W3C. (n.d.). Understanding SC 1.4.3: Contrast (Minimum) (Level AA). *Understanding WCAG 2.2*. https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
43. W3C. (n.d.). Relative luminance definition. *Web Content Accessibility Guidelines 2*. https://www.w3.org/TR/WCAG2/relative-luminance.html
44. W3C. (n.d.). Understanding SC 1.4.12: Text Spacing (Level AA). *Understanding WCAG 2.2*. https://www.w3.org/WAI/WCAG22/Understanding/text-spacing
45. W3C. (n.d.). Understanding SC 1.4.8: Visual Presentation (Level AAA). *Understanding WCAG 2.2*. https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation
46. W3C. (n.d.). Understanding SC 1.4.1: Use of Color (Level A). *Understanding WCAG 2.2*. https://www.w3.org/WAI/WCAG22/Understanding/use-of-color
47. W3C. (n.d.). Technique G183: Using a contrast ratio of at least 3:1 to distinguish inline text links from surrounding text. *Techniques for WCAG 2.2*. https://www.w3.org/WAI/WCAG22/Techniques/general/G183.html
48. Somers, A. (n.d.). APCA introduction [GitHub repository]. Myndex Research. https://github.com/Myndex/apca-introduction
49. Roselli, A. (2026, April). WCAG3 contrast as of April 2026. https://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html
50. Ottosson, B. (2020, December 23). A perceptual color space for image processing. https://bottosson.github.io/posts/oklab/
51. W3C CSS Working Group. (n.d.). CSS Color Module Level 4 [Editor's Draft]. https://drafts.csswg.org/css-color-4/
52. Li, C., Li, Z., Wang, Z., Luo, M. R., et al. (2017). Comprehensive color solutions: CAM16, CAT16, and CAM16-UCS. *Color Research and Application*, 42(6), 703–718. https://doi.org/10.1002/col.22131
53. Birch, J. (2012). Worldwide prevalence of red-green color deficiency. *Journal of the Optical Society of America A*, 29(3), 313–320. https://doi.org/10.1364/JOSAA.29.000313
54. Ngo, D. C. L., Teo, L. S., & Byrne, J. G. (2003). Modelling interface aesthetics. *Information Sciences*, 152, 25–46. https://doi.org/10.1016/S0020-0255(02)00404-8
55. Bauerly, M., & Liu, Y. (2006). Computational modeling and experimental investigation of effects of compositional elements on interface and design aesthetics. *International Journal of Human-Computer Studies*, 64(8), 670–682. https://doi.org/10.1016/j.ijhcs.2006.01.002
56. Müller-Brockmann, J. (1981). *Grid systems in graphic design*. Niggli. https://niggli.ch/en/grid-systems-in-graphic-design.html
57. Wikipedia contributors. (n.d.). Overshoot (typography). *Wikipedia*. https://en.wikipedia.org/wiki/Overshoot_(typography)
58. Chaparro, B., Baker, J. R., Shaikh, A. D., Hull, S., & Brady, L. (2004). Reading online text: A comparison of four white space layouts. *Usability News*, 6(2). https://portfolio.erau.edu/en/publications/reading-online-text-a-comparison-of-four-white-space-layouts/
59. Lin, D. Y. M. (2004). Evaluating older adults' retention in hypertext perusal: Impacts of presentation media as a function of text topology. *Computers in Human Behavior*, 20, 491–503. https://doi.org/10.1016/j.chb.2003.10.024
60. Coursaris, C. K., & Kripintris, K. (2012). Web aesthetics and usability: An empirical study of the effects of white space. *International Journal of E-Business Research*, 8(1), 35–53. https://doi.org/10.4018/jebr.2012010103
61. Wathan, A., & Schoger, S. (n.d.). *Refactoring UI* [book]. https://www.refactoringui.com/
62. Pickering, H., & Bell, A. (n.d.). Modular scale. In *Every Layout*. https://every-layout.dev/rudiments/modular-scale/
63. Gilyead, J., & Mudford, T. (n.d.). Utopia: Fluid responsive design. https://utopia.fyi/
64. Google. (n.d.). Layout: Metrics and keylines. *Material Design* (version 1). https://m1.material.io/layout/metrics-keylines.html
65. IBM. (n.d.). Spacing. *Carbon Design System*. https://carbondesignsystem.com/elements/spacing/overview/
