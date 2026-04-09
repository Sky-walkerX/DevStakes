// cases.js
// 🚨 TRUTH VS PERCEPTION UPDATE
// Data schema designed for dual-reality gameplay mechanics.
// Includes perception vs truth modes, timeline overrides, and system-level culpability.

export const CASES = [
  {
    id: "case-1",
    title: "Double Mystery in Jalvayu Vihar",
    subtitle: "Aarushi Talwar & Hemraj Case",
    description: "A 14-year-old girl and the family's live-in domestic worker are found dead. The initial investigation is handled chaotically, leading to wild media speculation. Navigate through tampered evidence and conflicting official narratives to find the truth behind the botched investigation.",
    difficulty: "Beginner",
    location: "Noida, 2008",
    timeOfCrime: "Night of May 15-16",
    victim: "Aarushi (14), Hemraj (45)",
    timeLimit: 900,
    emoji: "🩸",
    coverImage: "/cases/case1.png",
    multiRoleSystem: false,

    // Win condition logic
    correctSuspectId: "suspect-1-media-botch",

    suspects: [
      {
        id: "suspect-1-parents",
        name: "Rajesh & Nupur (Parents)",
        occupation: "Dentists",
        relation: "Parents of the victim",
        perceptionAlibi: "They were sleeping in the next room and heard nothing due to the AC noise.",
        truthAlibi: "Forensic reality showed no sign of forced entry. Narco tests were controversial, and the CBI teams clashed on their guilt.",
        alibi: "They were sleeping in the next room and heard nothing due to the AC noise.",
        contradictions: [],
        motive: "Perception: 'Honor killing' due to seeing Aarushi in a compromising position with Hemraj.",
        photo: "👨‍⚕️",
        color: "#6366f1"
      },
      {
        id: "suspect-1-krishna",
        name: "Krishna & Rajkumar",
        occupation: "Compounder & Domestic Help",
        relation: "Employees of the family / friends of Hemraj",
        perceptionAlibi: "Initially let go due to lack of evidence, but later accused by the first CBI team.",
        truthAlibi: "Blood-stained pillow covers traced to them, but chain-of-custody was highly compromised by the police.",
        alibi: "Initially let go due to lack of evidence, but later accused by the first CBI team.",
        contradictions: [],
        motive: "Perception: Altercation with Hemraj over drinking, followed by the murders.",
        photo: "👥",
        color: "#f59e0b"
      },
      {
        id: "suspect-1-media-botch",
        name: "Initial Police & Media",
        occupation: "UP Police",
        relation: "Investigators",
        perceptionAlibi: "Did their best but 'lost' evidence due to crowds.",
        truthAlibi: "Allowed the crime scene to be trampled by media and neighbors. Failed to find Hemraj's body on the roof for a full day.",
        alibi: "Did their best but 'lost' evidence due to crowds.",
        contradictions: [],
        motive: "Incompetence, leading to systemic failure requiring CBI intervention.",
        photo: "📰",
        color: "#ef4444"
      }
    ],

    evidence: [
      {
        id: "ev-1-1",
        title: "Hemraj's Body Location",
        type: "physical",
        description: "Initial reports state Hemraj is missing and the prime suspect.",
        mode: "perception",
        unlocked: true,
        inspectionAction: "Inspect Terrace Door",
        inspectionResult: "The terrace door was locked. Blood patterns found. Hemraj's body was on the roof the entire time while police searched elsewhere.",
        unlocksEvidence: ["ev-1-2"],
        breaksAlibiFor: "suspect-1-media-botch",
        icon: "🗝"
      },
      {
        id: "ev-1-2",
        title: "The Locked Terrace Door",
        type: "physical",
        description: "The terrace door handle had bloody prints, but was padlocked from the outside.",
        mode: "truth",
        unlocked: false,
        icon: "🚪",
        inspectionAction: "Analyze Prints",
        inspectionResult: "The blood on the padlock and panel belonged to Hemraj, proving the killer locked the door before leaving."
      },
      {
        id: "ev-1-3",
        title: "Media Broadcasts",
        type: "witness",
        description: "News channels broadcast the 'honor killing' theory extensively within 48 hours.",
        mode: "perception",
        unlocked: true,
        icon: "📺",
        inspectionAction: "Check Police Press Briefing",
        inspectionResult: "Police freely shared unverified assumptions with the media before forensics arrived.",
        breaksAlibiFor: "suspect-1-media-botch"
      },
      {
        id: "ev-1-4",
        title: "Clashing CBI Reports",
        type: "document",
        description: "CBI Team 1 suspects Krishna/Rajkumar. CBI Team 2 suspects the parents.",
        mode: "truth",
        unlocked: true,
        icon: "📁",
        inspectionAction: "Compare Reports",
        inspectionResult: "A broken chain-of-custody means physical evidence (golf club, pillowcases) was compromised, resulting in 'benefits of doubt'."
      }
    ],

    timeline: [
      { time: "May 15, 23:00", event: "Family goes to sleep. Hemraj is in his room.", suspect: null, mode: "both" },
      { time: "May 16, 06:00", event: "Maid arrives. Outer grill door is locked, but wooden door is open. Aarushi found dead.", suspect: null, mode: "both" },
      { time: "May 16, 09:00", event: "Police announce Hemraj is the killer.", suspect: "suspect-1-media-botch", mode: "perception" },
      { time: "May 17, 10:30", event: "Hemraj's body is discovered on the locked terrace by a retired police officer.", suspect: null, mode: "truth" }
    ]
  },

  {
    id: "case-2",
    title: "Midnight on Sanjeevani Road",
    subtitle: "BMW Hit-and-Run Case",
    description: "In the early hours of Delhi, a speeding BMW plows through a police checkpoint, killing 6. The rich heir behind the wheel flees. Witnesses turn hostile, the car is washed clean, and blood samples are 'lost'. Can you reconstruct the timeline through the cover-up?",
    difficulty: "Intermediate",
    location: "New Delhi, 1999",
    timeOfCrime: "04:30 AM",
    victim: "3 Policemen, 3 Civilians",
    timeLimit: 1200,
    emoji: "🚗",
    coverImage: "/cases/case2.png",
    multiRoleSystem: false,
    correctSuspectId: "suspect-2-driver",

    suspects: [
      {
        id: "suspect-2-driver",
        name: "Sanjeev (Heir)",
        occupation: "Business Scion",
        relation: "Driver of the BMW",
        perceptionAlibi: "I was not driving the car. It was my driver. I was at a party.",
        truthAlibi: "He was driving under the influence. Fled the scene to a friend’s house where they washed the car.",
        alibi: "I was not driving the car. It was my driver. I was at a party.",
        contradictions: ['ev-2-3'],
        motive: "Self-preservation. Wealth and influence allowed him to tamper with witnesses.",
        photo: "🕴",
        color: "#10b981"
      },
      {
        id: "suspect-2-manik",
        name: "Manik (Friend)",
        occupation: "Co-passenger",
        relation: "Friend of the Heir",
        perceptionAlibi: "I was dropped off earlier.",
        truthAlibi: "Was in the passenger seat. Helped coordinate the cover-up at the house.",
        alibi: "I was dropped off earlier.",
        contradictions: [],
        motive: "Accessory to the crime, protecting his powerful friend.",
        photo: "👥",
        color: "#6366f1"
      },
      {
        id: "suspect-2-witness",
        name: "Sunil (Star Witness)",
        occupation: "Bystander",
        relation: "Eyewitness",
        perceptionAlibi: "Stated in court: 'I saw a truck hit them, not a car. I don't recognize Sanjeev.'",
        truthAlibi: "He was the sole survivor who initially gave the BMW license plate to journalists. He was paid off.",
        alibi: "Stated in court: 'I saw a truck hit them, not a car. I don't recognize Sanjeev.'",
        contradictions: ['ev-2-2'],
        motive: "Bribed and threatened by the defense to turn hostile.",
        photo: "👁",
        color: "#f59e0b"
      }
    ],

    evidence: [
      {
        id: "ev-2-1",
        title: "Initial Witness Statement",
        type: "witness",
        description: "A TV journalist interviewed Sunil on the night of the crash where he clearly named the car.",
        mode: "truth",
        unlocked: true,
        inspectionAction: "View Interview Tape",
        inspectionResult: "Sunil clearly states a black BMW ran them over, providing a partial license plate.",
        unlocksEvidence: ["ev-2-2"],
        icon: "📼"
      },
      {
        id: "ev-2-2",
        title: "Hostile Court Testimony",
        type: "witness",
        description: "Official court transcript of Sunil claiming a truck did it.",
        mode: "perception",
        unlocked: true,
        inspectionAction: "Check Bank Records",
        inspectionResult: "A massive, untraceable cash deposit was made to Sunil's family the week prior.",
        breaksAlibiFor: "suspect-2-witness",
        icon: "⚖"
      },
      {
        id: "ev-2-3",
        title: "Washed BMW in Garage",
        type: "physical",
        description: "The BMW was found in a friend's garage, freshly washed.",
        mode: "both",
        unlocked: true,
        inspectionAction: "Run Luminol Test",
        inspectionResult: "Traces of victim's blood found underneath the fender and in the wheel wells despite the wash.",
        breaksAlibiFor: "suspect-2-driver",
        icon: "🚙"
      },
      {
        id: "ev-2-4",
        title: "Missing Blood Sample",
        type: "document",
        description: "Sanjeev's initial blood alcohol report went missing from the lab.",
        mode: "perception",
        unlocked: true,
        inspectionAction: "Audit Lab Logs",
        inspectionResult: "Log book shows the sample was signed out by a senior officer and never returned.",
        icon: "🩸"
      }
    ],

    timeline: [
      { time: "04:00 AM", event: "Sanjeev and Manik leave a late-night party.", suspect: "suspect-2-driver", mode: "both" },
      { time: "04:30 AM", event: "A speeding vehicle crashes through the police checkpost.", suspect: null, mode: "perception" },
      { time: "05:15 AM", event: "The BMW is secretly washed in a private garage.", suspect: "suspect-2-driver", mode: "truth" },
      { time: "Day 3", event: "Sunil gives press interview identifying the BMW.", suspect: "suspect-2-witness", mode: "truth" },
      { time: "Month 4", event: "Sunil turns hostile in court, claims it was a truck.", suspect: "suspect-2-witness", mode: "perception" }
    ]
  },

  {
    id: "case-3",
    title: "Shadows of the Drain",
    subtitle: "The Nithari Killings",
    description: "Over a span of 2 years, dozens of children go missing from a village adjacent to an affluent bungalow. Police dismiss the cases as runaways. When skeletal remains are finally found in the drain behind the house, an unimaginable horror is uncovered. This case requires assigning multiple culpabilities: The Executioner, The Facilitator, and Systemic Negligence.",
    difficulty: "Hard",
    location: "Noida, 2005 - 2006",
    timeOfCrime: "Multiple years",
    victim: "19+ Missing Children",
    timeLimit: 1500,
    emoji: "💀",
    coverImage: "/cases/case3.png",
    correctSuspectId: "suspect-3-servant",

    // NEW: Triggers the multi-role layout in the Accusation Modal (Truth vs Perception Endgame)
    multiRoleSystem: true,

    suspects: [
      {
        id: "suspect-3-servant",
        name: "Surinder (Servant)",
        occupation: "Domestic Worker",
        relation: "Employee at D-5",
        perceptionAlibi: "I was just a servant, I only did what I was told.",
        truthAlibi: "He lured children with sweets, murdered them, and disposed of evidence in the drain.",
        alibi: "I was just a servant, I only did what I was told.",
        contradictions: ['ev-3-3'],
        motive: "Severe psychopathy and cannibalistic tendencies.",
        photo: "🧹",
        color: "#ef4444",
        roles: { role: "Execution" }
      },
      {
        id: "suspect-3-owner",
        name: "Pandher (Owner)",
        occupation: "Businessman",
        relation: "Owner of Bungalow D-5",
        perceptionAlibi: "I was frequently away on business. I knew nothing of what happened in my house.",
        truthAlibi: "He facilitated the environment. There is heavy debate on his direct involvement in the murders, but he enabled the horrific conditions.",
        alibi: "I was frequently away on business. I knew nothing of what happened in my house.",
        contradictions: ['ev-3-4'],
        motive: "Apathy, extreme negligence, potential complicity.",
        photo: "👔",
        color: "#6366f1",
        roles: { role: "Enabler" }
      },
      {
        id: "suspect-3-police",
        name: "Local Police Chowki",
        occupation: "Law Enforcement",
        relation: "Jurisdiction",
        perceptionAlibi: "The children were likely runaways who left the village. We lack resources to track elopements.",
        truthAlibi: "They actively ignored FIRs from poor migrant families, dismissing missing lower-class children while responding immediately to high-profile complaints.",
        alibi: "The children were likely runaways who left the village. We lack resources to track elopements.",
        contradictions: ['ev-3-1'],
        motive: "Class bias, corruption, and systemic apathy.",
        photo: "🚓",
        color: "#f59e0b",
        roles: { role: "System Failure" }
      }
    ],

    evidence: [
      {
        id: "ev-3-1",
        title: "Missing Persons Logs",
        type: "document",
        description: "Official station diary showing 30+ missing complaints.",
        mode: "perception",
        unlocked: true,
        inspectionAction: "Check FIR Status",
        inspectionResult: "None of the complaints were officially registered as FIRs. They were just logged as 'informational'.",
        breaksAlibiFor: "suspect-3-police",
        icon: "📋"
      },
      {
        id: "ev-3-2",
        title: "The Drain Behind D-5",
        type: "physical",
        description: "Local residents found human remains while clearing a clogged municipal drain.",
        mode: "truth",
        unlocked: true,
        inspectionAction: "Forensic Sweep",
        inspectionResult: "Excavation revealed skulls, bones, and clothing belonging to the missing children, directly tracing back to the house's drainage pipe.",
        unlocksEvidence: ["ev-3-3", "ev-3-4"],
        icon: "☠"
      },
      {
        id: "ev-3-3",
        title: "Surinder's Confession Tape",
        type: "witness",
        description: "A chilling narco-analysis confession detailing the murders.",
        mode: "truth",
        unlocked: false,
        inspectionAction: "Review Core Claims",
        inspectionResult: "He admits to luring children, murdering them, and disposing partial remains.",
        breaksAlibiFor: "suspect-3-servant",
        icon: "📼"
      },
      {
        id: "ev-3-4",
        title: "Pandher's Travel Itinerary",
        type: "document",
        description: "Defense exhibits showing Pandher was in Australia during several victim disappearances.",
        mode: "perception",
        unlocked: false,
        inspectionAction: "Cross-reference Dates",
        inspectionResult: "While he was completely absent for some, phone records show he was present in the house during others. He knowingly ignored massive red flags.",
        breaksAlibiFor: "suspect-3-owner",
        icon: "✈"
      }
    ],

    timeline: [
      { time: "2004", event: "Migrant families begin reporting missing children.", suspect: null, mode: "both" },
      { time: "2005", event: "Police log the complaints as 'runaways' with no investigation.", suspect: "suspect-3-police", mode: "perception" },
      { time: "Dec 2006", event: "Villagers discover severely decomposed remains in the drain.", suspect: null, mode: "truth" },
      { time: "Jan 2007", event: "CBI takes over, discovering the horrific scale of the crimes inside D-5.", suspect: null, mode: "truth" }
    ]
  },
  {
    id: "case-4",
    title: "The Missing Wallet+",
    subtitle: "Restaurant Misdirection",
    description: "A wallet goes missing in a high-end restaurant. Everyone seems normal, but the CCTV shows something slightly off. Investigate the staff and guests to uncover the truth.",
    difficulty: "Beginner",
    location: "Le Petit Paris, 2026",
    timeOfCrime: "20:00 PM",
    victim: "VIP Guest",
    timeLimit: 900,
    emoji: "💼",
    coverImage: "/cases/case4.png",
    multiRoleSystem: false,
    correctSuspectId: "suspect-4-customer",
    suspects: [
      {
        id: "suspect-4-waiter",
        name: "Paul (Waiter)",
        occupation: "Waiter",
        relation: "Handled the table",
        perceptionAlibi: "I was busy fetching the wine from the cellar.",
        truthAlibi: "He handled the table properly, nothing nefarious.",
        alibi: "I was busy fetching the wine from the cellar.",
        contradictions: [],
        motive: "Needs money to pay off debts, potentially.",
        photo: "🤵",
        color: "#6366f1"
      },
      {
        id: "suspect-4-customer",
        name: "Evelyn (Customer)",
        occupation: "Socialite",
        relation: "Seated at adjacent table",
        perceptionAlibi: "I was powdering my nose in the restroom the entire time.",
        truthAlibi: "She slipped the wallet into her purse while the waiter was distracted.",
        alibi: "I was powdering my nose in the restroom the entire time.",
        contradictions: ["ev-4-3"],
        motive: "Kleptomania. Has a history of lifting items at events.",
        photo: "👱‍♀️",
        color: "#ef4444"
      },
      {
        id: "suspect-4-manager",
        name: "Louis (Manager)",
        occupation: "Shift Manager",
        relation: "Restaurant operator",
        perceptionAlibi: "I was in the back office doing inventory.",
        truthAlibi: "He accessed the CCTV briefly but didn't actually see the theft.",
        alibi: "I was in the back office doing inventory.",
        contradictions: ["ev-4-2"],
        motive: "General suspicion, but actually a red herring.",
        photo: "👨‍💼",
        color: "#f59e0b"
      }
    ],
    evidence: [
      {
        id: "ev-4-1",
        title: "Waiter's Statement",
        type: "witness",
        description: "The waiter claims he never saw the wallet after taking the order.",
        mode: "perception",
        unlocked: true,
        inspectionAction: "Question Waiter",
        inspectionResult: "He confirms Evelyn was seated very close strictly when the wallet owner went to the washroom.",
        unlocksEvidence: ["ev-4-2"],
        icon: "💬"
      },
      {
        id: "ev-4-2",
        title: "CCTV Access Logs",
        type: "digital",
        description: "Logs show the manager accessed the CCTV system around the time of the theft.",
        mode: "perception",
        unlocked: false,
        inspectionAction: "Check Access Reason",
        inspectionResult: "The manager was logging in to check a different camera for a reservation mix-up. This is a distraction.",
        breaksAlibiFor: "suspect-4-manager",
        icon: "💻"
      },
      {
        id: "ev-4-3",
        title: "Security Camera 3",
        type: "digital",
        description: "Footage from the back hallway camera.",
        mode: "truth",
        unlocked: true,
        inspectionAction: "Review Timecodes",
        inspectionResult: "Evelyn is seen returning from the bathroom 10 minutes earlier than she claimed, walking directly past the victim's empty table.",
        breaksAlibiFor: "suspect-4-customer",
        icon: "📹"
      },
      {
        id: "ev-4-4",
        title: "Restaurant Layout Plan",
        type: "document",
        description: "A blueprint of the restaurant seating.",
        mode: "both",
        unlocked: true,
        inspectionAction: "Check Blind Spots",
        inspectionResult: "The victim's table has a known blind spot from the main cameras but is highly visible to the adjacent table where Evelyn sat.",
        icon: "🗺️"
      },
      {
        id: "ev-4-5",
        title: "Empty Wine Glass",
        type: "physical",
        description: "A lipstick-stained glass left on the edge of Evelyn's table.",
        mode: "both",
        unlocked: true,
        inspectionAction: "Dust for Prints",
        inspectionResult: "The prints match Evelyn, establishing she was leaning heavily toward the victim's table.",
        icon: "🍷"
      },
      {
        id: "ev-4-6",
        title: "Credit Card Alert",
        type: "digital",
        description: "An alert indicating a failed attempt to use the victim's card at another boutique.",
        mode: "truth",
        unlocked: true,
        inspectionAction: "Trace Sale",
        inspectionResult: "The boutique is precisely across the street and the time of attempt aligns with Evelyn's hasty departure.",
        unlocksEvidence: ["ev-4-3"],
        icon: "💳"
      }
    ],
    timeline: [
      { time: "19:45 PM", event: "Victim's party arrives and places the wallet on the table.", suspect: null, mode: "both" },
      { time: "19:55 PM", event: "Waiter takes the order and goes to the cellar.", suspect: "suspect-4-waiter", mode: "perception" },
      { time: "20:00 PM", event: "Wallet vanishes. Manager checks the cameras for unrelated reasons.", suspect: "suspect-4-manager", mode: "perception" },
      { time: "20:05 PM", event: "Evelyn returns early from the restroom, claiming otherwise.", suspect: "suspect-4-customer", mode: "truth" }
    ]
  },
  {
    id: "case-5",
    title: "The Trusted Insider+",
    subtitle: "Ransom on the Highway",
    description: "A wealthy victim is kidnapped along a deserted misty highway. The ransom call comes from an unknown number. Investigate a conflicted timeline to untangle the truth from false leads.",
    difficulty: "Intermediate",
    location: "Route 66, 2026",
    timeOfCrime: "02:15 AM",
    victim: "CEO of TechCorp",
    timeLimit: 1200,
    emoji: "🚗",
    coverImage: "/cases/case5.png",
    multiRoleSystem: false,
    correctSuspectId: "suspect-5-driver",
    suspects: [
      {
        id: "suspect-5-driver",
        name: "Marcus (Driver)",
        occupation: "Personal Driver",
        relation: "Employee of the Victim",
        perceptionAlibi: "I wasn't driving that night. I lent the car to a friend.",
        truthAlibi: "He was driving. He turned off the GPS deliberately and staged the kidnapping.",
        alibi: "I wasn't driving that night. I lent the car to my cousin.",
        contradictions: ["ev-5-1", "ev-5-5"],
        motive: "Owed massive gambling debts.",
        photo: "🕴",
        color: "#ef4444"
      },
      {
        id: "suspect-5-neighbor",
        name: "Sarah (Neighbor)",
        occupation: "Freelancer",
        relation: "Lives next to Victim",
        perceptionAlibi: "I was just checking my mail when I bumped into him.",
        truthAlibi: "She was arguing about a property dispute, but is entirely unconnected to the kidnapping.",
        alibi: "I was just checking my mail when I bumped into him.",
        contradictions: ["ev-5-2"],
        motive: "Property lawsuit against the victim.",
        photo: "👩",
        color: "#f59e0b"
      },
      {
        id: "suspect-5-stranger",
        name: "Anonymous Caller",
        occupation: "Unknown",
        relation: "Ransom Demander",
        perceptionAlibi: "Masked voice over a burner phone.",
        truthAlibi: "Literally a voice synth operated by the driver's accomplice.",
        alibi: "Refuses to talk.",
        contradictions: ["ev-5-4"],
        motive: "To extort millions in crypto.",
        photo: "👤",
        color: "#6366f1"
      }
    ],
    evidence: [
      {
        id: "ev-5-1",
        title: "Toll Booth Logs",
        type: "document",
        description: "The toll booth captures a blurry photo of the driver.",
        mode: "truth",
        unlocked: true,
        inspectionAction: "Enhance Photo",
        inspectionResult: "The driver's silhouette strongly matches Marcus, contradicting his 'borrowed car' alibi.",
        breaksAlibiFor: "suspect-5-driver",
        icon: "🎟️",
        unlocksEvidence: ["ev-5-5"]
      },
      {
        id: "ev-5-2",
        title: "Ring Doorbell footage",
        type: "digital",
        description: "Shows Sarah aggressively arguing with the victim hours before the kidnap.",
        mode: "perception",
        unlocked: true,
        inspectionAction: "Listen to Audio",
        inspectionResult: "The argument is purely about a fence line. A mere distraction.",
        breaksAlibiFor: "suspect-5-neighbor",
        icon: "📹"
      },
      {
        id: "ev-5-3",
        title: "GPS Records",
        type: "digital",
        description: "The car's GPS was abruptly shut off.",
        mode: "both",
        unlocked: true,
        inspectionAction: "Check Last Ping",
        inspectionResult: "The last ping was right before a notoriously isolated patch of the highway.",
        icon: "📡"
      },
      {
        id: "ev-5-4",
        title: "The Ransom Audio",
        type: "digital",
        description: "An audio file of the kidnapper's demands.",
        mode: "truth",
        unlocked: true,
        inspectionAction: "Spectral Analysis",
        inspectionResult: "Background noise contains a distinct clicking sound matching the faulty AC unit in the victim's car.",
        breaksAlibiFor: "suspect-5-stranger",
        icon: "🎙️"
      },
      {
        id: "ev-5-5",
        title: "Marcus's Bank Statement",
        type: "document",
        description: "A series of massive, unaccounted deposits.",
        mode: "truth",
        unlocked: false,
        inspectionAction: "Audit Records",
        inspectionResult: "A giant crypto transfer was converted to cash in Marcus's name a day before the alleged kidnapping. He was buying gear.",
        breaksAlibiFor: "suspect-5-driver",
        icon: "🏦"
      },
      {
        id: "ev-5-6",
        title: "Abandoned Vehicle",
        type: "physical",
        description: "The victim's luxury SUV found ditched.",
        mode: "both",
        unlocked: true,
        inspectionAction: "Dust for Prints",
        inspectionResult: "The driver's seat was wiped clean, but Marcus's fingerprints were still on the hidden GPS toggle switch.",
        icon: "🚙"
      }
    ],
    timeline: [
      { time: "20:00 PM", event: "Neighbor Sarah argues with Victim. (Distraction)", suspect: "suspect-5-neighbor", mode: "perception" },
      { time: "01:30 AM", event: "Victim leaves event, enters his vehicle.", suspect: null, mode: "both" },
      { time: "02:00 AM", event: "GPS manually disconnected by the driver.", suspect: "suspect-5-driver", mode: "truth" },
      { time: "02:15 AM", event: "Ransom call is placed using voice modulator inside the vehicle.", suspect: "suspect-5-stranger", mode: "perception" }
    ]
  },
  {
    id: "case-6",
    title: "The Museum Heist+",
    subtitle: "Shattered Illusions",
    description: "A high-level heist orchestrated perfectly to steal the Queen's Sapphire. Multiple layers of security were bypassed. Complex systemic failure suggests an inside job combined with external execution.",
    difficulty: "Hard",
    location: "Global Museum of Antiquities, 2026",
    timeOfCrime: "Midnight",
    victim: "Museum Administration",
    timeLimit: 1500,
    emoji: "💎",
    coverImage: "/cases/case6.png",
    multiRoleSystem: true,
    correctSuspectId: "suspect-6-guard",
    suspects: [
      {
        id: "suspect-6-guard",
        name: "Arthur (Guard)",
        occupation: "Head of Security",
        relation: "On-duty supervisor",
        perceptionAlibi: "My radio died and the system glitched out.",
        truthAlibi: "He intentionally turned his radio off and looked away while the thieves moved in.",
        alibi: "My radio died and the system glitched out.",
        contradictions: ["ev-6-3"],
        motive: "Bribed to facilitate the robbery. Needs retirement money.",
        photo: "👮",
        color: "#ef4444",
        roles: { role: "Mastermind" }
      },
      {
        id: "suspect-6-contractor",
        name: "Viktor (Contractor)",
        occupation: "IT Alarm Specialist",
        relation: "Maintained the grid",
        perceptionAlibi: "I updated the software at 6 PM and went to a bar.",
        truthAlibi: "He installed a remote backdoor that disabled the motion sensors for exactly 2 minutes.",
        alibi: "I updated the software at 6 PM and went to a bar.",
        contradictions: ["ev-6-2", "ev-6-6"],
        motive: "Paid by the external crew to provide a window.",
        photo: "👨‍💻",
        color: "#f59e0b",
        roles: { role: "Facilitator" }
      },
      {
        id: "suspect-6-thieves",
        name: "The Ghost Crew",
        occupation: "Professional Thieves",
        relation: "External Invaders",
        perceptionAlibi: "No one saw them enter or exit.",
        truthAlibi: "They repelled in through a skylight precisely when Viktor spoofed the alarm and Arthur turned off his radio.",
        alibi: "Untraceable.",
        contradictions: ["ev-6-1"],
        motive: "Multi-million dollar payday.",
        photo: "🥷",
        color: "#6366f1",
        roles: { role: "Execution" }
      }
    ],
    evidence: [
      {
        id: "ev-6-1",
        title: "CCTV Blindspot Footage",
        type: "digital",
        description: "Workers with hidden faces are seen carrying equipment just outside the blindspot.",
        mode: "truth",
        unlocked: true,
        inspectionAction: "Enhance Feed",
        inspectionResult: "The thieves are seen bypassing the physical lock perfectly without drilling, meaning they had the exact masterkey sequence.",
        breaksAlibiFor: "suspect-6-thieves",
        icon: "📹"
      },
      {
        id: "ev-6-2",
        title: "Server Logs",
        type: "digital",
        description: "The security system was disabled for exactly 2 minutes.",
        mode: "both",
        unlocked: true,
        inspectionAction: "Check Access Token",
        inspectionResult: "The system wasn't hacked; a maintenance token belonging to Viktor was used to schedule a 'diagnostic reboot'.",
        breaksAlibiFor: "suspect-6-contractor",
        unlocksEvidence: ["ev-6-6"],
        icon: "🖥️"
      },
      {
        id: "ev-6-3",
        title: "Guard's Duty Radio",
        type: "physical",
        description: "Found on the desk, supposedly out of battery.",
        mode: "truth",
        unlocked: true,
        inspectionAction: "Use Battery Tester",
        inspectionResult: "The battery is at 80%. It was manually turned off, not dead.",
        breaksAlibiFor: "suspect-6-guard",
        icon: "📻"
      },
      {
        id: "ev-6-4",
        title: "Modified Entry Logs",
        type: "document",
        description: "Logs showing nobody entered the west wing.",
        mode: "perception",
        unlocked: true,
        inspectionAction: "Verify Log Integrity",
        inspectionResult: "The logs were retroactively edited from Arthur's terminal.",
        breaksAlibiFor: "suspect-6-guard",
        icon: "📋"
      },
      {
        id: "ev-6-5",
        title: "Shattered Display Glass",
        type: "physical",
        description: "The display case was cut expertly.",
        mode: "both",
        unlocked: true,
        inspectionAction: "Analyze Cut Marks",
        inspectionResult: "Industrial diamond cutter was used, a signature of the Ghost Crew.",
        icon: "🔍"
      },
      {
        id: "ev-6-6",
        title: "Bar Tab Receipt",
        type: "document",
        description: "Viktor's alibi receipt from the pub.",
        mode: "truth",
        unlocked: false,
        inspectionAction: "Check Timestamps",
        inspectionResult: "He was at the pub, but he logged into the museum's remote VPN from the pub's Wi-Fi network at 11:59 PM.",
        breaksAlibiFor: "suspect-6-contractor",
        icon: "🧾"
      }
    ],
    timeline: [
      { time: "18:00 PM", event: "Viktor ostensibly finishes server maintenance and leaves.", suspect: "suspect-6-contractor", mode: "perception" },
      { time: "23:58 PM", event: "Arthur manually turns off his duty radio.", suspect: "suspect-6-guard", mode: "truth" },
      { time: "23:59 PM", event: "System enters a 2-minute diagnostic loop globally.", suspect: "suspect-6-contractor", mode: "truth" },
      { time: "Midnight", event: "The Ghost Crew drops in, steals the sapphire, and exits within 90 seconds.", suspect: "suspect-6-thieves", mode: "both" }
    ]
  }
];

export function getCaseById(id) {
  return CASES.find(c => c.id === id);
}
