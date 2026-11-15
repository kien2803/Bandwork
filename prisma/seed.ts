import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const essays = [
  {
    task: "task2",
    title: "Free university education",
    prompt:
      "Some people believe that university education should be free for all students. To what extent do you agree or disagree?",
    band: 7.0,
    wordTarget: 250,
    content: `It is often argued that higher education ought to be provided at no cost to every student. While I accept that free tuition would widen access for poorer families, I believe that a fully state-funded system would be difficult to sustain and is not entirely fair.

On the one hand, removing tuition fees clearly benefits students from disadvantaged backgrounds. Many capable young people are currently put off applying to university because they fear graduating with a large debt. If education were free, admission would depend purely on academic ability rather than on a family's income, which would make society more equal. In addition, graduates who are not burdened by loans are freer to choose careers that benefit the public, such as teaching or nursing, instead of chasing the highest salary.

On the other hand, making university completely free places an enormous strain on government budgets. Taxpayers who never attend university would effectively subsidise those who do, and graduates typically earn considerably more over their lifetimes anyway. A more balanced approach, in my view, is a system of means-tested support, where low-income students receive grants while wealthier families continue to contribute. This targets help at those who genuinely need it without requiring unlimited public spending.

In conclusion, although free tuition would remove a real barrier for poorer students, I believe a partially funded model is fairer and more sustainable. Governments should focus on generous support for those who cannot afford fees rather than paying for everyone.`,
  },
  {
    task: "task2",
    title: "Public transport vs new roads",
    prompt:
      "Some people think governments should invest more money in public transport, while others believe building more roads is a better solution. Discuss both views and give your own opinion.",
    band: 7.0,
    wordTarget: 250,
    content: `Traffic congestion is a growing problem in most cities, and there is disagreement about how governments should respond. Some argue that spending on public transport is the wiser investment, whereas others favour expanding the road network. This essay will discuss both positions before explaining why I side with the former.

Supporters of building new roads point out that road capacity has not kept pace with the number of vehicles. Wider highways and new ring roads, they claim, reduce bottlenecks and shorten commuting times. Roads also matter for the economy: goods move almost entirely by lorry, and businesses depend on reliable delivery routes. For rural areas in particular, where buses and trains are impractical, road investment may be the only realistic option.

However, the case for public transport is stronger in my view. The main weakness of road building is induced demand: new capacity quickly fills up, and congestion returns within a few years. Efficient buses, trams and trains, by contrast, can move far more people per hour while producing less pollution per passenger. Cities such as Zurich and Singapore show that when public transport is fast, clean and affordable, people willingly leave their cars at home.

In conclusion, although roads are necessary and sometimes neglected, I believe governments should prioritise public transport. It offers a more lasting answer to congestion and is far better for the urban environment.`,
  },
  {
    task: "task1",
    title: "Households with internet access",
    prompt:
      "The chart below shows the percentage of households with internet access in three countries between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    band: 7.0,
    wordTarget: 170,
    content: `The bar chart illustrates the proportion of households that had internet access in Country A, Country B and Country C at five-year intervals from 2000 to 2020.

Overall, internet access rose sharply in all three countries over the period. Country A consistently had the highest penetration, while Country C remained the lowest, although the gap between them narrowed considerably by 2020.

In 2000, only around 15% of homes in Country A were connected, compared with roughly 8% in Country B and just 3% in Country C. Over the following decade, access grew steadily in each country, and by 2010 Country A had reached 60%, ahead of Country B at 45% and Country C at 25%.

The most dramatic change occurred between 2010 and 2020. Country A approached near-universal coverage at 95%, while Country B climbed to 82%. Country C saw the fastest relative growth, more than doubling to 70%, meaning that by the end of the period the majority of households in all three nations were online.`,
  },
  {
    task: "task1",
    title: "Coffee and tea consumption",
    prompt:
      "The chart below shows the amount of coffee and tea consumed per person in four countries in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    band: 7.0,
    wordTarget: 170,
    content: `The bar chart compares annual coffee and tea consumption per person across four countries in 2020. Figures are measured in kilograms.

Overall, coffee was the more popular drink in three of the four nations, while only Country D drank more tea than coffee. Country A recorded the highest coffee consumption by a clear margin, whereas tea drinking was most common in Country D.

In detail, the average person in Country A drank 7.5 kg of coffee, more than double the figure for tea at 3.1 kg. Country B showed a similar pattern, with 5.8 kg of coffee against 2.4 kg of tea. The gap was narrower in Country C, where coffee reached 4.2 kg and tea 3.0 kg.

Country D stood out as the exception: tea consumption, at 6.4 kg per person, was the highest of any category on the chart, while coffee accounted for just 2.1 kg. This made Country D the only nation where tea outsold coffee.`,
  },
  {
    task: "task2",
    title: "Working from home",
    prompt:
      "Nowadays, many people are able to do their work from home. Do the advantages of this development outweigh the disadvantages?",
    band: 7.0,
    wordTarget: 250,
    content: `Remote working has become widespread since technology made it possible to do most office jobs from anywhere. Although this shift brings some drawbacks, I believe the advantages are more significant for most workers.

Admittedly, working from home has real disadvantages. The most obvious is isolation: without daily contact with colleagues, people can feel lonely and disconnected from their organisation. Communication also suffers, because quick informal conversations are replaced by scheduled calls and messages. Furthermore, junior employees may learn more slowly when they cannot observe experienced colleagues, and some people struggle to separate their work from their private life when the office is the kitchen table.

Nevertheless, the benefits seem to outweigh these problems. The biggest gain is time: removing a daily commute can give workers back an hour or more each day, which improves both wellbeing and productivity. Employers benefit too, since they can hire from a wider pool of talent and need less expensive office space. There is also a broader social advantage, because fewer commuters mean quieter roads and lower emissions.

On balance, while remote work is not suitable for every role or every personality, I believe its advantages in flexibility, time saved and environmental benefit clearly outweigh the disadvantages, especially when companies keep some office days for collaboration and mentoring.`,
  },
  {
    task: "task2",
    title: "Learning a foreign language",
    prompt:
      "Some people think children should start learning a foreign language at primary school rather than secondary school. Do the advantages of this outweigh the disadvantages?",
    band: 7.0,
    wordTarget: 250,
    content: `There is a widespread belief that foreign languages should be taught from the first years of schooling. Although an early start has some drawbacks, I believe the advantages outweigh them.

Critics of early language learning raise reasonable concerns. The primary curriculum is already crowded with literacy and numeracy, and adding another subject risks overloading young pupils. There is also the question of quality: many primary teachers are not trained linguists, so lessons may be poorly delivered and even discourage children. Finally, the language learned at seven may simply be forgotten by adolescence if it is not maintained.

However, the case for starting early is stronger in my view. Young children absorb pronunciation and intonation almost effortlessly, giving them an accent older learners rarely achieve. Language learning at that age also develops general listening skills and cultural curiosity rather than feeling like a chore. Crucially, an early foundation means that by secondary school pupils can move to real communication instead of starting from scratch, when motivation tends to be lower.

In conclusion, while the practical difficulties of staffing and curriculum space are real, they can be managed with short, playful lessons. Starting young builds a pronunciation base and an attitude that pays off later, so on balance the advantages are greater.`,
  },
];

const paraphrases = [
  {
    original:
      "The number of people using public transport has increased dramatically over the past decade.",
    models: [
      "Public transport use has risen sharply in the last ten years.",
      "There has been a dramatic growth in the number of commuters on public transport during the past decade.",
    ],
    tips: [
      "Compress 'the number of people using' into a noun phrase: 'public transport use' or 'ridership'.",
      "'Increased dramatically' can become 'risen sharply', 'soared', or the noun 'a dramatic growth'.",
      "Vary the time phrase too: 'in the last ten years' instead of 'over the past decade'.",
    ],
  },
  {
    original:
      "Many children spend too much time playing computer games, which can affect their school work.",
    models: [
      "A lot of children devote excessive time to video games, and this may harm their academic performance.",
      "Spending long hours on computer games can negatively influence how well many children do at school.",
    ],
    tips: [
      "'Spend too much time' upgrades to 'devote excessive time to' or 'spend long hours on'.",
      "'School work' becomes 'academic performance' or 'their studies' in formal writing.",
      "Try starting with the gerund: 'Spending long hours on…' instead of 'Many children spend…'.",
    ],
  },
  {
    original:
      "Global warming is mainly caused by human activities such as burning fossil fuels.",
    models: [
      "Human actions, particularly the burning of fossil fuels, are the primary cause of climate change.",
      "The main driver of rising global temperatures is human activity, including the use of fossil fuels.",
    ],
    tips: [
      "Flip the passive: 'Human activities… are the primary cause of global warming.'",
      "'Global warming' has strong synonyms: 'climate change', 'rising global temperatures'.",
      "'Such as' tightens to 'particularly' or 'including'.",
    ],
  },
  {
    original:
      "Online learning has become increasingly popular because it is flexible and affordable.",
    models: [
      "Thanks to its flexibility and low cost, studying online is growing in popularity.",
      "More and more people choose online courses since they can study when they want at a reasonable price.",
    ],
    tips: [
      "Move the reason to the front: 'Thanks to its flexibility and low cost…'.",
      "'Has become increasingly popular' → 'is growing in popularity' or 'more and more people choose'.",
      "Unpack the adjectives: 'flexible' → 'study when they want'; 'affordable' → 'at a reasonable price'.",
    ],
  },
  {
    original:
      "Air pollution in large cities has reached dangerous levels in recent years.",
    models: [
      "In recent years, urban air quality has deteriorated to a point where it threatens public health.",
      "Large cities have recently experienced alarmingly high levels of air pollution.",
    ],
    tips: [
      "'Air pollution in large cities' compresses to 'urban air quality', which lets you recast the clause.",
      "'Reached dangerous levels' → 'deteriorated to a point where it threatens public health'.",
      "Open with the time phrase: 'In recent years, …' shifts the rhythm immediately.",
    ],
  },
  {
    original:
      "Young people today face more pressure to succeed than previous generations did.",
    models: [
      "Compared with earlier generations, today's youth are under greater pressure to achieve success.",
      "The pressure to do well in life is heavier for young people now than it was for their parents and grandparents.",
    ],
    tips: [
      "'Young people today' → 'today's youth' or 'younger generations'.",
      "'Face more pressure' → 'are under greater pressure'; or make 'pressure' the subject.",
      "Name the comparison: 'their parents and grandparents' instead of 'previous generations'.",
    ],
  },
  {
    original:
      "Some people believe that advertising encourages us to buy things we do not really need. They argue that adverts create artificial desires by making products seem more attractive than they actually are.",
    models: [
      "It is argued that advertising pushes consumers towards unnecessary purchases, as commercials tend to manufacture wants by presenting goods in an unrealistically appealing light.",
      "Critics of advertising claim it persuades people to acquire items they could live without, because adverts generate false needs and exaggerate a product's appeal.",
    ],
    tips: [
      "Merge or reorder the two sentences: one clause with 'as'/'because' reads differently from the original.",
      "'Encourages us to buy' → 'pushes consumers towards purchasing' or 'persuades people to acquire'.",
      "'Things we do not really need' → 'unnecessary purchases' or 'items they could live without'.",
    ],
  },
  {
    original:
      "Studying abroad gives students the chance to experience a different culture and improve their language skills. However, it can also be expensive and many students feel homesick during their first months away.",
    models: [
      "Although living overseas for education lets students immerse themselves in another culture and sharpen their language ability, the high costs and initial homesickness affect many of them.",
      "While overseas study offers cultural immersion and better language proficiency, it is often costly, and a lot of students struggle with missing home at first.",
    ],
    tips: [
      "Join the contrast in one sentence: lead with 'Although' or 'While' instead of a separate 'However' sentence.",
      "'Experience a different culture' → 'cultural immersion' or 'immerse themselves in another culture'.",
      "'Feel homesick' → 'struggle with missing home' or 'suffer from homesickness'.",
    ],
  },
];

const synonyms = [
  {
    passage:
      "The committee decided to postpone the annual conference until the following spring.",
    question: "The committee chose to delay the conference until the next spring.",
    targetWord: "delay",
    answerWord: "postpone",
    explanation: '"Postpone" means to move an event to a later time — the formal equivalent of "delay".',
  },
  {
    passage:
      "Researchers found that the drug significantly alleviated the patients' symptoms.",
    question: "The medication was found to reduce the symptoms of the illness.",
    targetWord: "reduce",
    answerWord: "alleviated",
    explanation: '"Alleviate" means to make pain or suffering less severe — to reduce it.',
  },
  {
    passage:
      "The ancient temple was constructed entirely from local sandstone.",
    question: "The temple was built using materials from the surrounding area.",
    targetWord: "built",
    answerWord: "constructed",
    explanation: '"Construct" is the formal word for "build", common in academic passages.',
  },
  {
    passage:
      "Freshwater makes up only a tiny fraction of the Earth's total water supply.",
    question: "A very small proportion of the planet's water is fresh.",
    targetWord: "proportion",
    answerWord: "fraction",
    explanation: '"Fraction" here means a small part or share — a proportion.',
  },
  {
    passage:
      "The government implemented strict measures to curb the spread of the disease.",
    question: "Authorities introduced tough rules to limit how far the disease spread.",
    targetWord: "limit",
    answerWord: "curb",
    explanation: '"Curb" means to restrain or keep something under control — to limit it.',
  },
  {
    passage:
      "His theory was initially met with considerable scepticism from the scientific community.",
    question: "At first, his theory faced a great deal of doubt from other scientists.",
    targetWord: "doubt",
    answerWord: "scepticism",
    explanation: '"Scepticism" is the noun for doubting that something is true or useful.',
  },
  {
    passage:
      "The two species diverged from a common ancestor millions of years ago.",
    question: "Both species evolved differently from one shared ancestor long ago.",
    targetWord: "shared",
    answerWord: "common",
    explanation: '"Common" and "shared" both describe something belonging to two or more parties.',
  },
  {
    passage:
      "Urban expansion has led to the fragmentation of many natural habitats.",
    question: "City growth has caused natural habitats to break into smaller pieces.",
    targetWord: "growth",
    answerWord: "expansion",
    explanation: '"Expansion" means an increase in size — growth, often of a city or economy.',
  },
];

const choices = [
  {
    original:
      "Schools should encourage students to participate in team sports.",
    options: [
      "Students ought to be motivated by schools to take part in group sports.",
      "Team sports should be compulsory for every student.",
      "Schools should encourage students to participate in team sports activities.",
    ],
    correct: 0,
  },
  {
    original:
      "The invention of the printing press changed the way information was shared.",
    options: [
      "The printing press was invented so that information could be printed.",
      "How people shared information was transformed by the invention of the printing press.",
      "Sharing information changed after people invented new printing methods.",
    ],
    correct: 1,
  },
  {
    original:
      "Despite the rain, the football match went ahead as planned.",
    options: [
      "The football match was cancelled because of the rain.",
      "The match took place as planned, although it rained heavily.",
      "It was raining, so the football match had to be rearranged.",
    ],
    correct: 1,
  },
  {
    original:
      "Not until the 19th century did the city become an important industrial centre.",
    options: [
      "The city had been an important industrial centre before the 19th century.",
      "The city only grew into a major industrial centre in the 19th century.",
      "Industrial centres appeared in the city throughout the 19th century.",
    ],
    correct: 1,
  },
  {
    original:
      "Hardly anyone expected the small startup to dominate the market within five years.",
    options: [
      "Almost no one predicted that the startup would lead the market in five years.",
      "The startup hardly dominated the market after five years of trading.",
      "People expected the small company to take over the market eventually.",
    ],
    correct: 0,
  },
  {
    original:
      "The museum attracts more visitors than any other attraction in the region.",
    options: [
      "The museum is the only attraction visitors come to see in the region.",
      "Other attractions in the region attract more visitors than the museum does.",
      "No other attraction in the region attracts as many visitors as the museum.",
    ],
    correct: 2,
  },
  {
    original:
      "It was not until the results were published that the team admitted the experiment had failed.",
    options: [
      "The team only admitted the experiment had failed once the results came out.",
      "The results were published because the experiment had failed.",
      "The team published the results before admitting their failure.",
    ],
    correct: 0,
  },
  {
    original:
      "Far from damaging the company's reputation, the recall actually improved customer confidence.",
    options: [
      "The recall damaged the company's reputation and reduced customer confidence.",
      "Customer confidence improved because the recall was badly handled.",
      "Rather than harming its reputation, the recall made customers trust the company more.",
    ],
    correct: 2,
  },
];

const dictations = [
  {
    title: "Health",
    level: 1,
    transcript:
      "Studies have shown that regular exercise improves both physical and mental health.",
  },
  {
    title: "Cities",
    level: 1,
    transcript:
      "The rapid growth of cities has created serious challenges for housing and transport.",
  },
  {
    title: "Technology",
    level: 1,
    transcript:
      "Many experts believe that artificial intelligence will transform the workplace within a generation.",
  },
  {
    title: "Environment",
    level: 1,
    transcript:
      "Access to clean water remains a major problem in many parts of the developing world.",
  },
  {
    title: "Work",
    level: 2,
    transcript:
      "The survey revealed that most employees prefer flexible working hours to higher pay.",
  },
  {
    title: "Energy",
    level: 2,
    transcript:
      "Although renewable energy is becoming cheaper, fossil fuels still dominate global power production.",
  },
];

const shadowing = [
  {
    part: 1,
    question: "Do you enjoy reading?",
    transcript:
      "Yes, I do. I try to read for half an hour every evening before bed, mostly novels. It's a good way for me to relax and switch off from screens.",
  },
  {
    part: 1,
    question: "What do you usually do in your free time?",
    transcript:
      "Mostly I like to get outside. If the weather's good, I'll go for a long walk or cycle along the river. Otherwise I cook or catch up with friends over coffee.",
  },
  {
    part: 1,
    question: "How often do you use public transport?",
    transcript:
      "Almost every day, actually. I take the bus to work because parking in the city centre is expensive. It's quite reliable, so I don't mind the commute.",
  },
  {
    part: 2,
    question: "Describe a person who has influenced you. (Opening sentences)",
    transcript:
      "I'd like to talk about my grandmother, who has probably influenced me more than anyone else. She raised four children while running a small shop, and she taught me the value of patience and hard work.",
  },
  {
    part: 3,
    question: "Do you think technology has made our lives better?",
    transcript:
      "On the whole, yes. Technology has made everyday tasks much more convenient, from banking to keeping in touch with family abroad. That said, I think we need to be careful not to depend on it too much.",
  },
  {
    part: 3,
    question: "Why do some people prefer to live in the countryside?",
    transcript:
      "I think the main reason is peace and quiet. Life in the countryside tends to be slower and less stressful, and people feel closer to nature. The downside, of course, is that there are fewer jobs and services.",
  },
];

const errorFixes = [
  {
    mistake: "word repetition",
    flawed:
      "Nowadays, technology is very important in our lives. Technology helps us do many things faster, and technology also connects people around the world.",
    corrected:
      "Nowadays, technology is very important in our lives. It helps us do many things faster, and it also connects people around the world.",
    explanation:
      "Repeating the same noun signals limited lexical range. Use pronouns ('it') or synonyms ('these tools', 'such devices') to vary reference.",
  },
  {
    mistake: "basic vocabulary",
    flawed:
      "Pollution is a big problem and the government should do more things to stop it.",
    corrected:
      "Pollution is a serious problem, and the government should take stronger measures to tackle it.",
    explanation:
      "'Big', 'things' and 'do' are too vague for IELTS. Upgrade to precise words: 'serious/significant', 'measures/steps', 'tackle/address'.",
  },
  {
    mistake: "simple sentence chains",
    flawed:
      "Many people work from home. It saves time. It is also more comfortable.",
    corrected:
      "Many people work from home because it saves time and is also more comfortable.",
    explanation:
      "Short simple sentences in a row keep grammar range low. Join ideas with 'because', 'which', 'while' or 'although' to build complex sentences.",
  },
  {
    mistake: "subject–verb agreement",
    flawed:
      "The number of students choosing online courses have increased a lot in recent years.",
    corrected:
      "The number of students choosing online courses has increased considerably in recent years.",
    explanation:
      "The subject is 'the number' (singular), not 'students': 'the number of… has', but 'a number of students have'. 'A lot' → 'considerably'.",
  },
  {
    mistake: "articles",
    flawed:
      "The pollution in big cities is getting worse, and the people need to use the public transport more.",
    corrected:
      "Pollution in big cities is getting worse, and people need to use public transport more.",
    explanation:
      "Generic plural and uncountable nouns take no article: 'pollution', 'people', 'public transport'. Keep 'the' for specific references.",
  },
  {
    mistake: "word form",
    flawed:
      "Online learning is more convenience than traditional classes, and it is also more cheap.",
    corrected:
      "Online learning is more convenient than traditional classes, and it is also cheaper.",
    explanation:
      "'Convenience' is a noun; the adjective is 'convenient'. 'Cheap' is a short adjective, so its comparative is 'cheaper', not 'more cheap'.",
  },
  {
    mistake: "double comparative",
    flawed:
      "Living in the countryside is more healthier than living in a busy city.",
    corrected:
      "Living in the countryside is healthier than living in a busy city.",
    explanation:
      "Never combine 'more' with an -er comparative: 'more healthier' → 'healthier' (or 'much healthier' for emphasis).",
  },
  {
    mistake: "overgeneralisation",
    flawed:
      "All young people prefer studying online because nobody likes going to school.",
    corrected:
      "Many young people prefer studying online, partly because some find classrooms restrictive.",
    explanation:
      "'All' and 'nobody' are impossible to prove and examiners penalise absolute claims. Soften with 'many', 'some', 'tend to', 'partly'.",
  },
];

const listenChoices = [
  {
    title: "Remote work",
    audio:
      "Working from home saves employees a significant amount of commuting time.",
    options: [
      "Employees working remotely spend much less time travelling to work.",
      "Remote employees commute more quickly than office staff.",
      "Commuting time is the main reason people choose to work from home.",
    ],
    correct: 0,
  },
  {
    title: "City transport",
    audio:
      "The city introduced cheaper bus fares to encourage people to leave their cars at home.",
    options: [
      "Bus fares were cut so that drivers would switch to public transport.",
      "The city forced people to stop driving by raising bus fares.",
      "Cheaper cars persuaded commuters to take the bus instead.",
    ],
    correct: 0,
  },
  {
    title: "Reading habits",
    audio:
      "Fewer young people read printed books than a decade ago, although overall reading has not declined.",
    options: [
      "Young people read less in total than they did ten years ago.",
      "Print reading among the young has fallen, but total reading is stable.",
      "Printed books are no longer read by anyone under a certain age.",
    ],
    correct: 1,
  },
  {
    title: "Exercise and health",
    audio:
      "Regular physical activity reduces the risk of heart disease even when it does not lead to weight loss.",
    options: [
      "Exercise only protects the heart if it makes you lose weight.",
      "Weight loss is the best way to avoid heart disease.",
      "Exercising regularly can protect the heart regardless of weight change.",
    ],
    correct: 2,
  },
  {
    title: "Water scarcity",
    audio:
      "Unless rainfall patterns change, the region will face severe water shortages within twenty years.",
    options: [
      "The region already suffers from severe water shortages.",
      "Severe water shortages are likely in two decades if rainfall stays the same.",
      "Changing rainfall patterns will end water shortages in twenty years.",
    ],
    correct: 1,
  },
  {
    title: "Sleep and study",
    audio:
      "Teenagers who sleep fewer than seven hours tend to perform worse at school, even if they study more.",
    options: [
      "Studying more helps teenagers do well at school despite little sleep.",
      "Extra study does not make up for the harm of short sleep in school results.",
      "Teenagers who study the hardest sleep the fewest hours.",
    ],
    correct: 1,
  },
];

async function main() {
  await db.attempt.deleteMany();
  await db.sampleEssay.deleteMany();
  await db.paraphraseExercise.deleteMany();
  await db.synonymExercise.deleteMany();
  await db.paraphraseChoice.deleteMany();
  await db.errorFix.deleteMany();
  await db.listenChoice.deleteMany();
  await db.dictationClip.deleteMany();
  await db.shadowingClip.deleteMany();
  await db.$executeRawUnsafe("DELETE FROM sqlite_sequence");

  await db.sampleEssay.createMany({ data: essays });
  await db.paraphraseExercise.createMany({ data: paraphrases.map((p) => ({ ...p, models: JSON.stringify(p.models), tips: JSON.stringify(p.tips) })) });
  await db.synonymExercise.createMany({ data: synonyms });
  await db.paraphraseChoice.createMany({ data: choices.map((c) => ({ ...c, options: JSON.stringify(c.options) })) });
  await db.errorFix.createMany({ data: errorFixes });
  await db.listenChoice.createMany({ data: listenChoices.map((c) => ({ ...c, options: JSON.stringify(c.options) })) });
  await db.dictationClip.createMany({ data: dictations });
  await db.shadowingClip.createMany({ data: shadowing });

  const counts = await Promise.all([
    db.sampleEssay.count(),
    db.paraphraseExercise.count(),
    db.synonymExercise.count(),
    db.paraphraseChoice.count(),
    db.errorFix.count(),
    db.listenChoice.count(),
    db.dictationClip.count(),
    db.shadowingClip.count(),
  ]);
  console.log("Seeded:", {
    essays: counts[0],
    paraphrases: counts[1],
    synonyms: counts[2],
    choices: counts[3],
    errorFixes: counts[4],
    listenChoices: counts[5],
    dictations: counts[6],
    shadowing: counts[7],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
