# Game design research for Design Quest: a literature review

## Abstract

This review collects the research and practitioner knowledge behind the mechanics of Design Quest, a browser game in which a new hire at Kerning & Co. reads short lessons, passes a judgment trial and fixes broken client pages while layout checks measure the rendered DOM. It covers design frameworks (MDA, Schell's lenses, Koster, Salen and Zimmerman), motivation (self-determination theory, flow, the overjustification effect, gamification meta-analyses), game feel and juice, reward schedules and progression, difficulty and failure, avatars and companion characters, curiosity and environmental narrative, the game theory of reward economies, and case studies from educational and puzzle games. The evidence is uneven. The strongest findings are that expected, task-contingent rewards reduce later free-choice interest in lab settings (Deci, Koestner and Ryan's 128-study meta-analysis), that gamification has small positive effects on learning whose motivational component is unstable (Sailer and Homner), that feedback effects are non-monotonic (moderate juice beats none and extreme juice), and that feedback tied to success outperforms amplified feedback (a pre-registered study with 1,699 players). Most game-feel guidance is practitioner opinion and is labelled as such. The paper ends with numbered design decisions for Design Quest, each tied to the evidence and to its strength.

## How to read this paper

"Research" means a peer-reviewed study or meta-analysis. "Practitioner view" or "design talk" means a developer's account, postmortem or design book that argues from experience. Duolingo's A/B tests are "company data": large, not peer-reviewed, and measuring engagement rather than learning. Effect sizes are given where the source states them.

## 1. Frameworks

### 1.1 MDA: mechanics, dynamics, aesthetics

Hunicke, LeBlanc and Zubek's MDA paper came out of the Game Design and Tuning Workshop run at the Game Developers Conference from 2001 to 2004 [1]. It splits a game into mechanics (rules and data), dynamics (the run-time behaviour of those rules when a player acts on them) and aesthetics (the emotional responses the player has). The paper's central claim is about perspective: "From the designer's perspective, the mechanics give rise to dynamic system behavior, which in turn leads to particular aesthetic experiences. From the player's perspective, aesthetics set the tone, which is born out in observable dynamics and eventually, operable mechanics" [1]. It names eight aesthetics: sensation, fantasy, narrative, challenge, fellowship, discovery, expression and submission, and argues that a game targets a subset of them [1]. It also frames tuning as iterative: changing reward thresholds and penalties until the dynamics produce the intended aesthetic [1].

MDA is a vocabulary, not an empirical finding. For Design Quest it is a diagnostic. The intended aesthetics are challenge (the client checks), discovery (the demos and the measured result of an edit), narrative (the Lorem & Ipsum thread) and expression (the player's CSS and rationale). A proposed effect that serves none of them is decoration, and Section 3 shows decoration has measurable costs at high doses.

### 1.2 Schell's lenses

Schell's *The Art of Game Design: A Book of Lenses* (first edition 2008) organises design advice as about one hundred "lenses", each a set of questions [2]. The first four are Experience, Surprise, Fun and Curiosity; the Lens of Curiosity asks the designer to think about the player's own motivations rather than the goals the game sets [2]. The book is a practitioner view. A lens works as a review checklist, which suits an agent-built project where each feature needs a written reason.

### 1.3 Koster: fun as learning

Koster's *A Theory of Fun for Game Design* (2004) grew out of a 2003 Austin Game Conference talk [3]. Its thesis is that fun in games comes from learning patterns: "Fun from games arises out of mastery. It arises out of comprehension. It is the act of solving puzzles that makes games fun" [3]. This is a practitioner argument, not a tested model, though it fits the competence research in Section 2. It predicts that a client page stops being fun once nothing is left to work out, which argues for three clients per desk that each need a different application of the principle, not three variants of one fix.

### 1.4 Salen and Zimmerman: meaningful play and the magic circle

Salen and Zimmerman's *Rules of Play* (MIT Press, 2003) defines meaningful play as what "occurs when the relationships between actions and outcomes in a game are both discernible and integrated into the larger context of the game" [4]. Discernible means the player can perceive the result of an action; integrated means the result matters later [4]. The book also adopts Huizinga's "magic circle" for the bounded space in which a game's rules apply, entered through what Bernard Suits called the lusory attitude [4].

The judge panel already makes each CSS edit discernible. It becomes integrated when a passed check changes something the player cares about later: the problems bar, the stars, the case-study export. The magic circle explains why the fiction matters in a learning game: a player who accepts that they work at Kerning & Co. reads a failed check as a client's problem, not a mark against them.

## 2. Motivation

### 2.1 Self-determination theory and PENS

Ryan, Rigby and Przybylski (2006) applied self-determination theory (SDT) to video games in three studies in which participants played one, two and four games respectively [5]. Perceived in-game autonomy and competence were associated with enjoyment, game preference and changes in well-being from before to after play [5]. The Player Experience of Need Satisfaction (PENS) measure comes from this line of work. The finding is correlational within each study, but it replicates across the three studies and across games [5].

In Design Quest, the measured checks supply competence (the player sees a number move), and the open map plus acceptance of any passing CSS supply autonomy. Relatedness, the third SDT need, rests only on Ada and the client briefs.

### 2.2 Flow

Csikszentmihalyi's *Flow* (1990) describes a state of deep, effortless involvement during which people report enjoyment and lose track of time [6]. Chen (2007) applied it to games, arguing that a well-designed game keeps each player inside their own "Flow Zone", a band where challenge matches skill, and that players' zones differ [7]. Sweetser and Wyeth (2005) turned flow into the GameFlow heuristic model with eight elements: concentration, challenge, player skills, control, clear goals, feedback, immersion and social interaction [8]. Their feedback criteria are that "players should receive feedback on progress toward their goals", "players should receive immediate feedback on their actions" and "players should always know their status or score" [8].

GameFlow's validation is thin: expert reviews of two real-time strategy games, one highly rated and one poorly rated, which it told apart [8]. Chen's argument is a design essay. The flow literature's contribution here is a requirement that difficulty be adjustable per player (Section 5).

### 2.3 Extrinsic rewards and the overjustification effect

Lepper, Greene and Nisbett (1973) observed 51 preschool children who already chose to draw in free play [10]. One group was told in advance that drawing would earn a "Good Player" certificate; a second received the same certificate unexpectedly; a third received nothing [10]. The study is the origin of the overjustification effect: the expected reward, not the reward itself, undermined later interest in an activity the children already enjoyed [10].

Deci, Koestner and Ryan's 1999 meta-analysis of 128 experiments is the strongest evidence on the question [9]. Engagement-contingent, completion-contingent and performance-contingent rewards all reduced free-choice intrinsic motivation (d = -0.40, -0.36 and -0.28). Positive feedback increased both free-choice behaviour (d = 0.33) and self-reported interest (d = 0.31) [9]. The finding is contested. Cameron and Pierce's 1994 meta-analysis of 96 studies concluded that reward does not decrease intrinsic motivation overall, finding a negative effect only for expected tangible rewards given for simply doing a task [11]. Deci, Koestner and Ryan's analysis was in part a reply and argued that the earlier analysis was flawed [9]. The two camps agree on one point that matters here: verbal or informational positive feedback does not undermine interest, and expected tangible rewards for doing a task can.

XP, stars and badges are symbolic, not tangible, and can be framed as information about performance or as payment for compliance. SDT holds that the framing decides the effect.

### 2.4 Does gamification work?

Hamari, Koivisto and Sarsa's 2014 review of empirical gamification studies concluded that "gamification provides positive effects, however, the effects are greatly dependent on the context in which the gamification is being implemented, as well as on the users using it" [12]. Sailer and Homner's 2020 meta-analysis is narrower and stronger: gamification of learning had small significant effects on cognitive outcomes (g = 0.49, k = 19, N = 1,686), motivational outcomes (g = 0.36, k = 16, N = 2,246) and behavioural outcomes (g = 0.25, k = 9, N = 951) [13]. Only the cognitive effect held up in the subset of studies with high methodological rigour; the motivational and behavioural effects were less stable [13].

Two experiments isolate individual elements. Mekler and colleagues (2017) ran a 2 × 4 online experiment (N = 273) in an image-tagging task with points, levels, a leaderboard or none [14]. No game element changed intrinsic motivation or perceived competence, but points, and especially levels and the leaderboard, increased the number of tags produced; the authors concluded the elements worked "as extrinsic incentives, effective only for promoting performance quantity" [14]. Hanus and Fox (2015) compared a university course with mandatory badges and a leaderboard against an identical non-gamified course over a semester and found lower intrinsic motivation and lower class satisfaction in the gamified section, which they attributed to social comparison and the loss of autonomy from compulsory badges [15].

Gamification layers raise the amount people do more reliably than they raise interest, and mandatory, comparative layers can lower interest.

## 3. Game feel and juice

### 3.1 Practitioner sources

Swink's *Game Feel* (Morgan Kaufmann, 2008) treats the feel of control as a designable property, covering topics such as sound, ancillary indicators, metaphor and perception [16]. It is a practitioner book. The best-known statement of "juice" is Jonasson and Purho's talk "Juice it or lose it", delivered at Nordic Game Jam in 2012 and later shown at GDC Europe, in which they took a plain Breakout clone and added tweening, stretching, squeezing and sound live on stage [17]. Purho's summary was: "If a game's juicy, it's way more fun to interact with it and it feels more professional" [17]. This is a design talk with no data behind it, and it was the starting point for the studies below.

### 3.2 Empirical studies of juiciness

Hicks, Dickinson, Holopainen and Gerling (2018) surveyed 17 game developers and built a framework of what developers mean by juicy design [18]. Hicks, Gerling, Dickinson and Vanden Abeele (2019) then tested visual embellishments, defined as redundant feedback in which one action triggers several non-functional reactions, in two studies: one with 40 participants across two research games and one with 32 participants playing Quake 3 Arena [19]. Embellishments raised visual appeal in every game but affected competence only under specific conditions [19].

Kao (2020) built four versions of one action RPG with no, medium, high and extreme juiciness. Medium and high juiciness outperformed both no juiciness and extreme juiciness on all measures [20]. The relationship is an inverted U: some juice helps, and too much is worse than a moderate amount.

Kao, Ballou, Gerling, Breitsohl and Deterding (2024) ran a pre-registered online experiment with 1,699 participants to find out why juice works [21]. They tested three pathways: effectance (the pleasure of causing effects), competence and curiosity. Curiosity was the strongest predictor of enjoyment and the only predictor of playtime. Success-dependent feedback, where the size of the response tracks how well the player did, raised all three motives. Amplified feedback, more effect regardless of success, reduced them, which the authors attribute to a loss of agency [21]. Their conclusion is that good feedback depends on "legible action-outcome bindings and graded success" [21].

Lin, Duan, Wen and Cai (2022) trained a language model on Steam reviews of top-selling action games, scored games on "impact feel", and compared the eight best with the eight worst across 19 feedback features [22]. Hit stop (a brief freeze on impact), sound coherence and camera control separated the two groups most clearly [22]. This is correlational and from a combat genre, so it supports hit stop as a technique without telling Design Quest how long a pause should be.

The research converges on a rule more specific than "add juice": feedback should track the result, show cause and effect, and stay moderate in amount. The 2024 study, the largest and the only pre-registered one, contradicts the practitioner instinct that more effect is better.

### 3.3 Animation principles

Thomas and Johnston's *The Illusion of Life* (1981) sets out Disney's twelve principles of animation, including squash and stretch, anticipation, follow-through and overlapping action, slow in and slow out, timing and exaggeration [23]. They are craft knowledge, not experimental findings, but they suit an SVG sprite and rubber stamps: anticipation makes a stamp's landing readable and squash on impact gives it weight.

### 3.4 Feedback timing

Nielsen's response-time limits, drawn from Miller (1968) and Card and colleagues (1991), are 0.1 second for a response to feel instantaneous, 1 second for the user's flow of thought to stay unbroken, and 10 seconds before attention is lost [24]. These are human-factors guidelines, widely used and stable for decades, but not tied to a single experiment.

In learning research, feedback timing is less settled. Shute's review of formative feedback (2008) found no consistent main effect of immediate versus delayed feedback [25]. Immediate feedback tends to help with difficult tasks, procedural skills and lower-achieving learners; delayed feedback has some support for transfer, especially for higher achievers [25]. Shute reports a meta-analysis of computer-based instruction (Azevedo and Bernard) in which feedback versus none produced a mean weighted effect of 0.80 on immediate outcomes and 0.35 on delayed outcomes [25]. CSS layout is a procedural skill that is hard for a new player, which favours immediate feedback on the judge panel; the written rationale adds the delayed, reflective step.

### 3.5 Motion and accessibility

WCAG 2.x Success Criterion 2.3.3 (Animation from Interactions, level AAA) requires that motion triggered by interaction can be disabled unless it is essential [26]. The W3C guidance names vestibular disorders, whose reactions include dizziness, nausea and headaches, and points to the `prefers-reduced-motion` media query as the standard mechanism [26]. The W3C example is motion triggered by scrolling; screen shake moves the whole view and falls under the same criterion. Design Quest's own design-system rule that every effect has a still alternative meets this criterion.

## 4. Rewards and progression

### 4.1 Reward schedules and the ethical critique

Ferster and Skinner's *Schedules of Reinforcement* (1957) catalogued how ratio and interval schedules shape response rates [27]. Variable-ratio schedules, which pay out after an unpredictable number of responses, produce high and steady response rates and the greatest resistance to extinction. Hopson's "Behavioral Game Design" (2001), a practitioner article, mapped these schedules onto game rewards and presented them as tools for keeping players playing [28]. The article treats the schedules as design recipes and does not discuss whether to use them [28].

The critique comes from two directions. Zagal, Björk and Lewis (2013) defined "dark game design patterns": design whose purpose works against the player's interests and can be called unethical [29]. Zendle and Cairns (2018) surveyed 7,422 adult gamers and found a link between loot box spending and problem gambling severity (η² = 0.054), about thirteen times stronger than the link for other in-game spending (η² = 0.004) [30]. The study is cross-sectional and cannot show direction, but it is large and the contrast between randomised and fixed purchases is specific.

Design Quest has no purchases, but the structure can appear without money as random XP drops or mystery unlocks. It adds nothing to learning.

### 4.2 Core loops, XP and levels

A core loop is the repeated cycle of action and reward; Design Quest's is lesson, trial, clients, rationale, ship. Points and levels raise quantity without changing intrinsic motivation [14]. Ranks from Intern to Creative Director give the fiction a career arc, which serves the narrative aesthetic [1]; their motivational value beyond that is not established.

### 4.3 Badges

Hamari's 2017 field study added a badge system to a peer-to-peer trading service and compared a pre-implementation cohort (N = 1,410, observed for a year) with a post-implementation cohort (N = 1,579, observed for a year) [31]. Users in the gamified period were more likely to post trade proposals, complete transactions, comment and use the service overall [31]. The design compares two cohorts in sequence, not randomised groups, so other changes over the two years cannot be ruled out. Hanus and Fox's classroom study, in which badges were mandatory and paired with a leaderboard, found the opposite effect on motivation [15]. The difference between the two settings is voluntariness: badges that record what a player chose to do look safe; badges that a player must collect behave like controlling rewards.

### 4.4 Streaks and loss aversion

Duolingo has published several company-run experiments on its daily streak. Making a streak require one lesson per day, rather than meeting a daily goal, raised 14-day retention by 3.3%, daily active learners by 1%, and the share of daily learners on a streak of seven days or more from about a third to just over half within a year [33]. A "Weekend Amulet" that protected the streak over a weekend made learners 4% more likely to return a week later and 5% less likely to lose their streak; a streak wager raised day-7 retention by 14% [32]. Allowing two Streak Freezes at once raised daily active learners by 0.38%, and new milestone animations raised the share of new learners continuing past seven days by 1.7% [34]. Duolingo's own explanation names loss aversion as one of the forces that keeps longer streaks going [34].

These results come from the company that profits from the metric, are not peer-reviewed, and measure return visits, not learning. Their pattern is still consistent: each change that made the streak more forgiving increased engagement.

Loss aversion comes from prospect theory: Kahneman and Tversky (1979) showed that people value outcomes as gains and losses from a reference point, with a value function "steeper for losses than for gains" [35]. A long streak becomes a reference point, so breaking it feels like a loss larger than the equivalent gain. That is why streaks retain users and why they can turn practice into an obligation. Design Quest's trial streak, free to break, keeps the visible progress without the loss.

## 5. Difficulty and failure

### 5.1 Dynamic difficulty

Hunicke (2005) built Hamlet, a dynamic difficulty adjustment system on the Half-Life engine that used inventory theory and operations research to adjust the supply and demand of in-game inventory [36]. Automatic adjustment has a cost in a learning game: if the game quietly lowers a threshold, a pass no longer certifies the skill. Design Quest's thresholds are its curriculum, so difficulty should vary through layers the player chooses (bonus checks, New Game+, hints).

### 5.2 The art of failure

Juul's *The Art of Failure* (MIT Press, 2013) asks why people play games in which they are almost certain to fail and feel bad about it [37]. Juul argues that describing games as "fun" is mostly mistaken: players frown, grimace and shout as they lose, and different kinds of game design make failure feel personal in different ways [37]. This is a humanities essay, not an experiment. Its relevance is that a failing check is what makes passing it worth something, provided the failure tells the player what to do next. "Fail forward", a practitioner term, describes failure that yields information or progress rather than a reset; every Design Quest edit that fails still updates the measured values, so failure is informative by construction.

### 5.3 Assist modes

Celeste's Assist Mode lets players change game speed, stamina, the number of air dashes and whether they can die [38]. Matt Thorson's in-game message says Celeste was designed to be "a challenging, but accessible game" and that its difficulty is "essential to the experience", while the studio wanted players to leave feeling capable, which meant teaching, challenging and supporting them through failure [38]. Thorson described the modifications as breaking the game from a designer's point of view and accepted that trade-off [38]. This is a design account, not data, but it is a clear example of separating the intended difficulty from the difficulty a player must accept.

### 5.4 Productive struggle

Kapur (2008) introduced "productive failure": students who attempt complex problems before instruction, and mostly fail, can learn more than those taught first [39]. Sinha and Kapur's 2021 meta-analysis of 53 studies and 166 comparisons found a moderate effect in favour of problem solving followed by instruction (g = 0.36, 95% CI 0.20 to 0.51), rising to between 0.37 and 0.58 when the design followed productive-failure principles closely, and to an estimated 0.87 after correcting for publication bias [40]. The effect reversed for second to fifth graders and for domain-general skills [40].

Two related findings show that effective practice often feels worse. Roediger and Karpicke (2006) found that students who took recall tests on a passage, without feedback, remembered more after a week than students who restudied it (56% against 42% in Experiment 1), even though restudying won on a five-minute test [41]. Kornell and Bjork (2008) found that interleaving paintings by different artists improved learning of the artists' styles, yet 78% of participants judged massed study as at least as effective, even after doing better with interleaving [42]. A game tuned to how practice feels will drift towards the less effective options. Lesson gates are retrieval practice and the arcade's mixed flaw types are interleaving; both should survive any change made to smooth the experience.

## 6. Characters and avatars

### 6.1 Identification and customisation

Birk, Atkins, Bowey and Mandryk (2016) ran an 11-day study of a game for training executive function and manipulated how strongly players identified with their in-game avatar [43]. Motivation fell over time in both groups, but effort and enjoyment fell faster among players who identified less [43]. When an extrinsic reward was introduced after a week, the less-identified group responded positively and the more-identified group responded negatively, reducing effort and performance [43]. This mirrors the overjustification pattern inside a game: players who were already intrinsically engaged were harmed by an added reward.

Turkay and Kinzer studied 66 players of Lord of the Rings Online over about ten hours in four sessions across two weeks, with or without avatar customisation [44]. Both customisation and time played increased identification with the avatar [44].

### 6.2 The Proteus effect

Yee and Bailenson (2007) named the Proteus effect: people's behaviour shifts towards the traits of the avatar they are given [45]. Ratan, Beyea, Li and Graciano's meta-analysis of 46 experiments found a small-to-medium effect between 0.22 and 0.26, consistent across studies [46]. Much of this research uses immersive virtual reality and embodied avatars; whether it transfers to a small 2D sprite beside a quiz is untested. The safe reading for Design Quest is that the player's chosen look supports identification [43, 44], and any behavioural benefit beyond that should not be claimed.

### 6.3 Companion and mentor characters

Schroeder, Adesope and Gilbert's meta-analysis of pedagogical agents (43 studies, 3,088 participants) found a small but significant effect on learning [47]. Agents helped school-age learners more than post-secondary learners, and agents that communicated through on-screen text helped more than those that used narration [47]. Ada is a text-based mentor, which is the better-supported form, and the effect size is a reason to keep her role in framing and story rather than to move instruction into her dialogue.

### 6.4 Personality through verbs

Untitled Goose Game is the clearest case of a player character whose personality comes from what it can do. House House's account is that "the goose's verbs are the things we thought a goose does: honking, running, moving their neck, flapping their wings", and that controlling it should feel "like controlling a puppet for an audience, even if that audience was just the player themselves" [48]. The team found it "was funnier when the goose tried to steal things when people weren't looking", which turned the game towards stealth [48]. This is a developer account. The lesson for Design Quest's sprite is that a small set of states tied to real game events (think, cheer, wince, sweat, walk) gives more character than a large set of idle animations.

## 7. Narrative

### 7.1 The curiosity gap

Loewenstein's 1994 review reinterpreted curiosity as a deprivation that arises "when attention becomes focused on a gap in one's knowledge" and motivates people to obtain the missing information [49]. The account set out to explain why people seek out curiosity voluntarily and which situations trigger it, two points earlier theories had missed [49]. Kao and colleagues' 2024 finding that curiosity was the strongest predictor of enjoyment and playtime in their juiciness study [21] connects this directly to game feedback: uncertain outcomes hold attention.

### 7.2 Environmental storytelling

Jenkins's "Game Design as Narrative Architecture" (2004) argues that games tell stories through space as much as through plot [50]. He distinguishes evoked narratives (spaces that call on stories the player already knows), enacted narratives (spaces where events are staged), embedded narratives (information placed in the mise-en-scène for the player to piece together) and emergent narratives (resources for players to make their own) [50]. Design Quest's broken client pages are embedded narrative: the Lorem & Ipsum credit in each footer and the recurring failure patterns let the player infer the template mill's habits before any note states them.

### 7.3 Mystery as a hook in practice

Valve's developer commentary for Portal records that the team "crammed a lot of little details into the environments" to sustain interest in Aperture Science and GLaDOS [51]. Papers, Please shows the risk of mixing story and instruction: Lucas Pope avoided introducing new rules on days when a character speaks to the player, because "the bulletin is basically ignored when you've got someone to talk to right away" [52]. SpaceChem shows the risk of tying story to difficulty: Zach Barth reports that only about 2% of players reached the end of a 40-hour difficulty curve, so most never saw the story's conclusion, and recommends putting the hardest content after the end of the story [53]. All three are practitioner accounts, but they come from shipped games with large audiences and they agree with each other.

## 8. Game theory applied to reward economies

### 8.1 Basic concepts

Von Neumann and Morgenstern's *Theory of Games and Economic Behavior* (1944) founded game theory as the analysis of strategic choice under defined rules and payoffs [54]. Nash (1950) defined the equilibrium that bears his name: a strategy profile in which no player can gain by changing only their own strategy [55]. A strategy is dominant if it does at least as well as every alternative whatever others do, and strictly better against some; a rational player with a dominant strategy plays it.

Mechanism design, sometimes called reverse game theory, starts from the outcome the designer wants and works backwards to rules under which self-interested players produce it [56]. Hurwicz, Maskin and Myerson received the 2007 economics Nobel prize "for having laid the foundations of mechanism design theory" [56]. A mechanism is incentive-compatible when each participant's best response is the behaviour the designer intends [56].

### 8.2 The player's decision problem

A single-player game is a mechanism with one strategic participant: the designer commits to rules and the player maximises what they value, which for some players is XP. If an unwanted action, such as repeating an easy task, earns XP faster than anything else, it becomes the XP-maximising strategy. Games call this farming. It is the dominant strategy the rules created, not irrational play.

Under a per-attempt payout, if a three-star client paid 240 XP on every ship, re-shipping the shortest client from a remembered solution would earn more XP per minute than any new work, because new work includes time spent failing.

### 8.3 Why improvement-only payouts remove the farming strategy

Design Quest pays only the improvement over the previous best. Let the value of a result be v(s), non-decreasing in the star count s, with v(1) = 100, v(2) = 160 and v(3) = 240. Let b be the best result so far, with v(b) = 0 before the first ship. An attempt with result s pays max(0, v(s) − v(b)) and then sets b to the larger of b and s. Three properties follow.

1. Replaying at or below the previous best pays nothing. The farming strategy has a payoff of zero and is weakly dominated by any action with a chance of improvement or new content.
2. Total XP from a client is v(best result ever reached), whatever the order of attempts. Shipping one star, then two, then three pays 100 + 60 + 80 = 240, the same as shipping three stars first. There is no incentive to sandbag (score low on purpose to collect more later).
3. Total XP is bounded. Each level is worth at most 910 XP before badges, New Game+ multiplies its own separate records by 1.5, and badges pay once. Since XP cannot grow without bound, it cannot be farmed.

Under these rules the only actions that raise XP are doing better or doing something new, which are the actions the designer wants. In mechanism-design terms the payout rule is incentive-compatible with respect to farming.

### 8.4 Remaining exploit surfaces

Incentive compatibility only holds for what is measured. The player optimises the checks, so any gap between a check and its principle becomes a strategy. The core `intact` check closes the largest gap (passing contrast or spacing by hiding or shrinking text), and keeping reference solutions out of the bundle removes copying. The remaining surfaces are small. Rerolling the trial for an easier draw is bounded by the one-off 30 XP perfect bonus and is still retrieval practice. An edited save code harms nobody in a single-player game with no leaderboard. Memorising a daily arcade seed earns nothing while the arcade pays no XP. The speed and no-hint badges reward behaviours the game may not want, which item 11 in Section 10 takes up.

No peer-reviewed source on single-player reward economies was located for this review. The analysis applies general definitions [54, 55, 56] and is reasoning, not an empirical finding.

## 9. Case studies

### 9.1 Duolingo

Duolingo's streak experiments are summarised in Section 4.4 [32, 33, 34]. The lesson that survives the caveats is that its successful streak changes lowered the cost of keeping a streak or added slack, and none added punishment. No source located here links the streak to learning gains.

### 9.2 Brilliant

Brilliant's site describes its method as "learn by doing" with interactive problems, and its AI tutor as one that "never just gives you the answer", asking guiding questions and giving hints instead [57]. The site gives no independent effectiveness data [57]. The general claim it rests on is well supported: Freeman and colleagues' meta-analysis of 225 studies found that active learning raised exam and concept-inventory performance by 0.47 standard deviations over lecturing in undergraduate STEM, and that students in lecture courses were 1.95 times as likely to fail [58]. Design Quest's lesson demos and goal gates are active learning in this sense.

### 9.3 Flexbox Froggy, Grid Garden and CSS Diner

These three are the closest relatives of Design Quest. Thomas Park built Flexbox Froggy after meeting Luke Pacholski, creator of CSS Diner, at Mozilla Festival, and was surprised by its reception among both beginners and experienced developers [59]. Park's view is that "coding games could make a good complement to more traditional ways of learning" [59]. Flexbox Froggy has the player write flexbox declarations to move frogs onto lily pads [60]; Grid Garden has them water carrots and poison weeds with CSS grid properties [61]. CSS Diner has the player type selectors to pick items off a table, with an HTML viewer that highlights markup as the player hovers over items [62].

All three show a visual target state and an immediate visual result, one property or selector at a time. They teach syntax and property behaviour; none asks whether a layout is good, which is Design Quest's subject. The cost is a less visible target, which the client problems bar restores.

### 9.4 Flexbox Defense

Flexbox Defense turns flexbox into tower defense: the player positions towers with flexbox properties, then enemies test the placement [63]. Applying a property is followed by a consequence the player watches play out. Design Quest's equivalent is the problems bar emptying.

### 9.5 Papers, Please

Papers, Please is a rules-checking game with a bureaucratic rulebook that grows day by day [52]. Lucas Pope said the bureaucratic structure "made it easy for me to fill out a complex set of gameplay-oriented rules and regulations", described the shutter clack and the stamp as central to its feel, and hand-scheduled every encounter because adding one could disrupt the rest of the game [52]. Its relevance to Design Quest is close: the player applies a rulebook (the Field Guide) to documents (client pages), and the stamp is already the chosen feedback object. Pope's rule about not mixing new regulations with dialogue applies to Ada's notes and new lesson content.

### 9.6 Zachtronics: solution histograms

In SpaceChem, Zach Barth replaced global leaderboards with score histograms to solve two problems: leaderboards encouraged cheating and demoralised most players [53]. The histograms show "how your solution stacks up against the aggregate" without naming anyone, and players use them to set personal goals [53]. Barth calls them one of the most popular features [53]. His postmortem also records the tutorial's failures: objectives were unclear, the simplest solution was too complex, and too much detail arrived at once. He concluded that a need for lengthy text explanations is a sign to redesign the mechanic rather than explain it more [53]. Design Quest makes no network calls, so it cannot show other players' results; a histogram of the player's own attempts is the version that fits.

### 9.7 Untitled Goose Game

Beyond Section 6.4, House House notes the goose is "never really that bad or that cruel", which lets players cause mischief without guilt [48]. Design Quest's sprite needs the same tone when it winces at a regression: rueful, not ashamed.

### 9.8 Portal

Valve's developer commentary describes Portal as "effectively an extended player training exercise", introducing tools and then layering them into harder puzzles (Robin Walker) [51]. Kim Swift reports that playtesters understood portals faster after seeing themselves through one, so the first portal was placed to guarantee that view [51]. Momentum was the hardest concept to teach and was introduced step by step (Garret Rickey), and when playtesters missed an objective the team added cues such as a ticking timer while a door was open (Jason Brashill) [51]. Early versions that let players progress without understanding "really compromised teaching new concepts" (Robin Walker) [51]. This is a well-documented case of teaching through level design, and it supports gates that require understanding before progress.

### 9.9 Baba Is You

Arvi Teikari designs Baba Is You levels backwards from an interaction he finds surprising or funny, then builds a level that requires it [64]. He values "simple but hard-to-wrap-your-head-around situations" and replays each level to find unintended solutions, deciding whether to block or keep them [64]. For Design Quest, each client page should rest on one insight about its principle, and reference solutions should be checked for alternative passing CSS that skips the insight.

## 10. Implications for Design Quest

Each item gives the decision, the evidence and its strength.

1. **Bind sprite reactions to judge outcomes, not keystrokes.** Cheer when a check newly passes, wince when a passing check regresses, think while the debounced measurement runs. Success-dependent feedback raised curiosity, competence and effectance and amplified feedback lowered them (N = 1,699, pre-registered) [21]; this is Salen and Zimmerman's discernibility in practice [4]. Strong.

2. **Scale celebration to the result.** Small stamp for a core check, large stamp for a shipped job, star sequence and confetti only on the results screen. Medium and high juice beat none and extreme [20]; confetti on every check or trial answer moves towards the extreme condition. Moderate to strong.

3. **Keep the client problems bar honest.** One segment per failing core check, a segment returns on regression, bonus checks never appear on it. It meets GameFlow's "always know their status" criterion [8] and gives the visible target that Flexbox Froggy and CSS Diner get for free [60, 62]. Showing progress the checks did not measure would break the action-outcome binding [21]. Moderate.

4. **Animate stamps with anticipation and a short hit stop, inside the response budget.** Use anticipation, impact squash and settle [23]; hit stop is the feature most associated with good impact feel [22]. Start within 0.1 s of the event, finish within about 1 s [24], never block input. Craft knowledge and correlational data; durations need playtesting.

5. **No screen shake by default.** No verified research supports it here and it is the effect most likely to trigger vestibular symptoms [26]. If added, limit it to shipping a job and disable it under reduced motion.

6. **Give every effect a still alternative.** Under `prefers-reduced-motion` or the Motion setting the stamp appears in place, the sprite changes pose without travel and confetti becomes a static ribbon. This meets WCAG 2.3.3 [26] and keeps the information, which is what carries the benefit [21].

7. **Immediate feedback on the judge panel and trial answers; keep the rationale as the reflective step.** Immediate feedback suits hard procedural tasks and newer learners, and delayed feedback has some support for transfer [25]. Mixed evidence, interpreted.

8. **Frame XP, stars and badges as information.** Write "Heading ratio now 1.3×, needed 1.25×", not "Earn XP!", and avoid "you must" in reward copy. Expected task-contingent rewards reduced free-choice interest (d = -0.28 to -0.40) while positive feedback raised it (d = 0.33) [9]; points and levels raised output but not interest [14]; mandatory badges with a leaderboard lowered motivation [15]. Strong on direction, contested on size [11].

9. **Keep improvement-only payouts and add no other XP sources.** The rule makes repetition worthless, removes sandbagging and bounds total XP (Section 8.3). Login bonuses, per-attempt payouts or arcade XP would reopen farming. Reasoned from definitions [54, 55, 56].

10. **No randomised rewards.** Variable-ratio schedules drive persistent responding [27], loot box spending is associated with problem gambling (N = 7,422, η² = 0.054) [30], and such mechanics fit the definition of dark patterns [29]. Strong association, direction unknown.

11. **Rethink the "no hints" and "under five minutes" badges.** They reward not asking for help and rushing. Celeste attaches no penalty to assistance [38], productive struggle needs support as well as difficulty [39, 40], and speed pressure works against item 7. Move them to New Game+ or replace them, for example with a badge for recovering from a regression or for shipping all three clients of a desk. Practitioner view plus inference.

12. **Keep badges voluntary and named after skills.** Badges raised activity in a non-randomised field study [31] and lowered motivation when mandatory and paired with a leaderboard [15]. Never gate content behind a badge. Moderate.

13. **Keep the trial streak free to break and add no daily streak.** Each forgiving change to Duolingo's streak raised engagement [32, 33, 34], and loss aversion explains how a long streak becomes an obligation [35]. Any future cross-day streak needs freeze-style slack and must never remove earned progress. Company data plus established theory.

14. **Show the player their own distribution, not a leaderboard.** A histogram of the player's own arcade runs and client times gives the personal-goal effect Barth describes [53], avoids social comparison [15] and needs no network.

15. **Keep lesson gates, and put some goal gates before the explanation.** Retrieval beat restudying at one week (56% against 42%) [41]; problem solving before instruction has meta-analytic support beyond primary school (g = 0.36) [40]. Do not remove gates because they feel slower; learners misjudge effective practice [42]. Strong.

16. **Keep mixed flaw types in the arcade.** Interleaving improved category learning although 78% of participants judged massing at least as good [42]. Moderate to strong.

17. **Vary difficulty only through layers the player chooses.** Bonus checks, New Game+ and hints play the role of Celeste's options [38]; hidden changes to core thresholds [36] would make a pass mean less.

18. **Make the Lorem & Ipsum ending reachable with core checks only.** SpaceChem tied its story to difficulty and about 2% of players saw the end [53]. New Game+ and three-star play come after the story. Practitioner view.

19. **End each desk with a specific question.** "Why does every Lorem & Ipsum footer use the same 13px grey?" names a gap [49]; "Something is wrong at Lorem & Ipsum" does not. Curiosity was the strongest predictor of playtime in the largest juiciness study [21]. Moderate.

20. **Tell the story through the client pages too.** Put recurring Lorem & Ipsum habits in markup, footers and comments visible in the read-only HTML tab [50], as Portal filled its rooms with Aperture details [51].

21. **Never introduce a new rule on a screen with a story beat.** Players ignore the bulletin when a character speaks [52]. Keep Ada's opening note apart from the first lesson page. Practitioner view.

22. **Use the avatar choice for identification and attach no surprise rewards to it.** Customisation raised identification [44] and identification slowed the decline in effort and enjoyment, but a reward added after a week lowered effort in identified players [43]. Do not claim a Proteus effect for a 2D sprite; the meta-analytic effect (0.22 to 0.26) rests largely on immersive virtual reality studies [46]. Moderate.

23. **Give the sprite personality through a few work verbs.** The goose's character came from its verbs [48]. Think, cheer, wince, sweat and walk, each tied to an event, are enough; idle fidgets during lesson reading would break the plan's rule against motion over text.

24. **Keep Ada in text, as mentor and narrator.** Pedagogical agents have a small positive effect, larger with on-screen text than narration [47]. Instruction stays on sourced lesson pages. Moderate.

25. **Build each client around one insight and audit alternative solutions.** Design backwards from the mistake the client teaches [64], introduce then layer concepts as Portal did [51], and check that no simpler CSS passes the core checks without applying the principle; where one does, add a check as `intact` does. Practitioner view plus Section 8.4.

26. **Treat long tutorial text as a design fault.** Barth found that extended explanation means the mechanic needs redesign [53], and Portal's team added cues rather than text when players got stuck [51]. If a lesson page needs more than a short statement and a demo, change the demo.

27. **Playtest with need-satisfaction and curiosity measures, not only completion time.** The most informative studies measured competence, autonomy and curiosity alongside behaviour [5, 21]. A short questionnaire in local playtests is enough to tell whether an effect helps or only adds motion.

## References

1. Hunicke, R., LeBlanc, M. and Zubek, R. (2004). MDA: A Formal Approach to Game Design and Game Research. Paper from the Game Design and Tuning Workshop, Game Developers Conference, San Jose, 2001 to 2004. <https://users.cs.northwestern.edu/~hunicke/MDA.pdf>
2. Schell, J. (2008). The Art of Game Design: A Book of Lenses (first edition). British Library record: <https://eld.bl.uk/catalog/018393125>
3. Koster, R. (2004). A Theory of Fun for Game Design. Paraglyph Press. <https://www.learningguild.com/articles/well-read-a-theory-of-fun-for-game-design>
4. Salen, K. and Zimmerman, E. (2003). Rules of Play: Game Design Fundamentals. MIT Press. <https://en.wikipedia.org/wiki/Rules_of_Play> and <https://en.wikipedia.org/wiki/Meaningful_play>
5. Ryan, R. M., Rigby, C. S. and Przybylski, A. K. (2006). The Motivational Pull of Video Games: A Self-Determination Theory Approach. Motivation and Emotion, 30(4), 347-363. <https://doi.org/10.1007/s11031-006-9051-8>
6. Csikszentmihalyi, M. (1990). Flow: The Psychology of Optimal Experience. Harper & Row. <https://search.worldcat.org/title/20392741>
7. Chen, J. (2007). Flow in Games (and Everything Else). Communications of the ACM, April 2007. <https://doi.org/10.1145/1232743.1232769>
8. Sweetser, P. and Wyeth, P. (2005). GameFlow: A Model for Evaluating Player Enjoyment in Games. ACM Computers in Entertainment, 3(3), Article 3A. <https://ntnu.no/wiki/download/attachments/112986425/GameFlow.pdf?api=v2>
9. Deci, E. L., Koestner, R. and Ryan, R. M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. Psychological Bulletin, 125(6), 627-668. <https://doi.org/10.1037/0033-2909.125.6.627>
10. Lepper, M. R., Greene, D. and Nisbett, R. E. (1973). Undermining children's intrinsic interest with extrinsic reward: A test of the "overjustification" hypothesis. Journal of Personality and Social Psychology, 28(1), 129-137. <https://doi.org/10.1037/h0035519>
11. Cameron, J. and Pierce, W. D. (1994). Reinforcement, reward, and intrinsic motivation: A meta-analysis. Review of Educational Research, 64(3), 363-423. <https://journals.sagepub.com/doi/10.3102/00346543064003363>
12. Hamari, J., Koivisto, J. and Sarsa, H. (2014). Does Gamification Work? A Literature Review of Empirical Studies on Gamification. Proceedings of the 47th Hawaii International Conference on System Sciences, 3025-3034. <https://doi.org/10.1109/HICSS.2014.377>
13. Sailer, M. and Homner, L. (2020). The Gamification of Learning: a Meta-analysis. Educational Psychology Review, 32(1), 77-112. <https://link.springer.com/article/10.1007/S10648-019-09498-W>
14. Mekler, E. D., Brühlmann, F., Tuch, A. N. and Opwis, K. (2017). Towards understanding the effects of individual gamification elements on intrinsic motivation and performance. Computers in Human Behavior, 71, 525-534. <https://doi.org/10.1016/j.chb.2015.08.048>
15. Hanus, M. D. and Fox, J. (2015). Assessing the effects of gamification in the classroom: A longitudinal study on intrinsic motivation, social comparison, satisfaction, effort, and academic performance. Computers & Education, 80, 152-161. <https://doi.org/10.1016/j.compedu.2014.08.019>
16. Swink, S. (2008). Game Feel: A Game Designer's Guide to Virtual Sensation. Morgan Kaufmann. <https://shop.elsevier.com/books/game-feel/swink/978-0-12-374328-2>
17. Jonasson, M. and Purho, P. (2012). Juice It or Lose It (design talk, Nordic Game Jam 2012; later shown at GDC Europe). Summary and video: Game Developer, "Video: Is your game juicy enough?" <https://www.gamedeveloper.com/design/video-is-your-game-juicy-enough->
18. Hicks, K., Dickinson, P., Holopainen, J. and Gerling, K. (2018). Good Game Feel: An Empirically Grounded Framework for Juicy Design. Proceedings of DiGRA 2018. <https://dl.digra.org/index.php/dl/article/view/936>
19. Hicks, K., Gerling, K., Dickinson, P. and Vanden Abeele, V. (2019). Juicy Game Design: Understanding the Impact of Visual Embellishments on Player Experience. Proceedings of CHI PLAY 2019. <https://doi.org/10.1145/3311350.3347171>
20. Kao, D. (2020). The effects of juiciness in an action RPG. Entertainment Computing, 34. <https://www.sciencedirect.com/science/article/pii/S1875952118300879>
21. Kao, D., Ballou, N., Gerling, K., Breitsohl, H. and Deterding, S. (2024). How does juicy game feedback motivate? Testing curiosity, competence, and effectance. Proceedings of CHI 2024. <https://doi.org/10.1145/3613904.3642656>
22. Lin, Z., Duan, H., Wen, Z. A. and Cai, W. (2022). What Features Influence Impact Feel? A Study of Impact Feedback in Action Games. IEEE International Conference on Games, Entertainment and Media (GEM 2022). <https://arxiv.org/abs/2208.06155>
23. Thomas, F. and Johnston, O. (1981). Disney Animation: The Illusion of Life (book). <https://en.wikipedia.org/wiki/Disney_Animation:_The_Illusion_of_Life>
24. Nielsen, J. (1993). Response Times: The 3 Important Limits. Nielsen Norman Group. <https://www.nngroup.com/articles/response-times-3-important-limits/>
25. Shute, V. J. (2008). Focus on Formative Feedback. Review of Educational Research, 78(1), from p. 153. <https://doi.org/10.3102/0034654307313795>
26. W3C (2018, current). Understanding Success Criterion 2.3.3: Animation from Interactions (Level AAA). Web Content Accessibility Guidelines 2.1. <https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions>
27. Ferster, C. B. and Skinner, B. F. (1957). Schedules of Reinforcement. B. F. Skinner Foundation edition: <https://www.bfskinner.org/product/schedules-of-reinforcement-pdf/>
28. Hopson, J. (2001). Behavioral Game Design. Gamasutra (now Game Developer). <https://www.gamedeveloper.com/design/behavioral-game-design>
29. Zagal, J. P., Björk, S. and Lewis, C. (2013). Dark Patterns in the Design of Games. Foundations of Digital Games 2013. <https://research.chalmers.se/en/publication/177148>
30. Zendle, D. and Cairns, P. (2018). Video game loot boxes are linked to problem gambling: Results of a large-scale survey. PLOS ONE. <https://doi.org/10.1371/journal.pone.0206767>
31. Hamari, J. (2017). Do badges increase user activity? A field experiment on the effects of gamification. Computers in Human Behavior, 71, 469-478. <https://doi.org/10.1016/j.chb.2015.03.036>
32. Loh, K. H. (2017). How Streaks keep Duolingo learners committed to their language goals. Duolingo Blog (company data). <https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals>
33. Yu, A. (2020). Improving the streak: Forming habits one lesson at a time. Duolingo Blog (company data). <https://blog.duolingo.com/improving-the-streak>
34. Mansur, O. (2024). Post on Duolingo streak research and habit building (read in its Japanese edition). Duolingo Blog (company data). <https://blog.duolingo.com/duolingo-streak-research/>
35. Kahneman, D. and Tversky, A. (1979). Prospect Theory: An Analysis of Decision under Risk. Econometrica, 47(2), 263-291. <http://www.jstor.org/stable/1914185>
36. Hunicke, R. (2005). The case for dynamic difficulty adjustment in games. Proceedings of the International Conference on Advances in Computer Entertainment Technology (ACE 2005). <https://users.cs.northwestern.edu/~hunicke/pubs/Hamlet.pdf>
37. Juul, J. (2013). The Art of Failure: An Essay on the Pain of Playing Video Games. MIT Press. <https://www.jesperjuul.net/ludologist/2013/02/25/the-art-of-failure/>
38. Klepek, P. (2018). Why The Very Hard 'Celeste' is Perfectly Fine With You Breaking Its Rules. Vice, 7 February 2018. <https://www.vice.com/en/article/celeste-difficulty-assist-mode>
39. Kapur, M. (2008). Productive Failure. Cognition and Instruction, 26(3), 379-424. <https://doi.org/10.1080/07370000802212669>
40. Sinha, T. and Kapur, M. (2021). When Problem Solving Followed by Instruction Works: Evidence for Productive Failure. Review of Educational Research, 91(5), 761-798. <https://doi.org/10.3102/00346543211019105>
41. Roediger, H. L. and Karpicke, J. D. (2006). Test-Enhanced Learning: Taking Memory Tests Improves Long-Term Retention. Psychological Science, 17(3), 249-255. <https://doi.org/10.1111/j.1467-9280.2006.01693.x>
42. Kornell, N. and Bjork, R. A. (2008). Learning Concepts and Categories: Is Spacing the "Enemy of Induction"? Psychological Science, 19(6), 585-592. <https://doi.org/10.1111/j.1467-9280.2008.02127.x>
43. Birk, M. V., Atkins, C., Bowey, J. T. and Mandryk, R. L. (2016). Fostering Intrinsic Motivation through Avatar Identification in Digital Games. Proceedings of CHI 2016, 2982-2995. <https://doi.org/10.1145/2858036.2858062>
44. Turkay, S. and Kinzer, C. K. (2015). The Effects of Avatar-Based Customization on Player Identification. In Gamification: Concepts, Methodologies, Tools, and Applications, IGI Global. <https://doi.org/10.4018/978-1-4666-8200-9.ch012>
45. Yee, N. and Bailenson, J. (2007). The Proteus Effect: The Effect of Transformed Self-Representation on Behavior. Human Communication Research, 33(3), 271-290. <https://doi.org/10.1111/j.1468-2958.2007.00299.x>
46. Ratan, R., Beyea, D., Li, B. J. and Graciano, L. (2020). Avatar characteristics induce users' behavioral conformity with small-to-medium effect sizes: a meta-analysis of the proteus effect. Media Psychology, 23(5), 651-675 (online 2019). <https://doi.org/10.1080/15213269.2019.1623698>
47. Schroeder, N. L., Adesope, O. O. and Gilbert, R. B. (2013). How Effective are Pedagogical Agents for Learning? A Meta-Analytic Review. Journal of Educational Computing Research, 49(1), 1-39. <https://doi.org/10.2190/EC.49.1.a>
48. Disseldorp, N. (2020). Road to the IGF: House House's Untitled Goose Game. Game Developer. <https://www.gamedeveloper.com/game-platforms/road-to-the-igf-house-house-s-i-untitled-goose-game-i->
49. Loewenstein, G. (1994). The Psychology of Curiosity: A Review and Reinterpretation. Psychological Bulletin, 116(1), 75-98. <https://stafforini.com/works/loewenstein-1994-psychology-curiosity-review/>
50. Jenkins, H. (2004). Game Design as Narrative Architecture. In N. Wardrip-Fruin and P. Harrigan (eds.), First Person: New Media as Story, Performance, and Game. MIT Press. <https://web.mit.edu/~21fms/People/henry3/games&narrative.html>
51. Valve (2007). Portal developer commentary (Swift, Walker, Rickey, Brashill, Dalton, Wolpaw). Transcribed at <https://theportalwiki.com/wiki/Portal_developer_commentary>
52. Alexander, L. (2013). Designing the bleak genius of Papers, Please. Game Developer, 3 September 2013. <https://www.gamedeveloper.com/design/designing-the-bleak-genius-of-i-papers-please-i->
53. Barth, Z. (2012). Postmortem: Zachtronics Industries' SpaceChem. Game Developer, 13 June 2012. <https://gamedeveloper.com/design/postmortem-zachtronics-industries-i-spacechem-i->
54. von Neumann, J. and Morgenstern, O. (1944). Theory of Games and Economic Behavior. Princeton University Press. <https://press.princeton.edu/books/paperback/9780691130613/theory-of-games-and-economic-behavior>
55. Nash, J. F. (1950). Equilibrium points in n-person games. Proceedings of the National Academy of Sciences, 36(1), 48-49. <https://doi.org/10.1073/pnas.36.1.48>
56. Wikipedia contributors (accessed 2026). Mechanism design (encyclopaedia overview, including the 2007 Nobel citation for Hurwicz, Maskin and Myerson). Wikipedia. <https://en.wikipedia.org/wiki/Mechanism_design>
57. Brilliant (accessed 2026). Brilliant: Learn by doing (company site, product claims). <https://brilliant.org/>
58. Freeman, S., Eddy, S. L., McDonough, M., Smith, M. K., Okoroafor, N., Jordt, H. and Wenderoth, M. P. (2014). Active learning increases student performance in science, engineering, and mathematics. PNAS, 111(23), 8410-8415. <https://doi.org/10.1073/pnas.1319030111>
59. Brown, D. (2021). Hacks Decoded: Thomas Park, Founder of Codepip. Mozilla Hacks, 20 October 2021. <https://hacks.mozilla.org/2021/10/hacks-decoded-thomas-park-founder-of-codepip/>
60. Codepip. Flexbox Froggy (game page). <https://codepip.com/games/flexbox-froggy/>
61. Codepip. Grid Garden (game page). <https://codepip.com/games/grid-garden/>
62. Pacholski, L. CSS Diner (game). <https://flukeout.github.io/>
63. Flexbox Defense (game; description at Diablo Design interactive learning directory). <https://diablodesign.eu/tools/interactive-learning/flexbox-defense>
64. Couture, J. (2018). Road to the IGF: Hempuli Oy's Baba Is You. Game Developer, 15 February 2018. <https://www.gamedeveloper.com/disciplines/road-to-the-igf-hempuli-oy-s-i-baba-is-you-i->
