export interface Question {
  question: string
  options: string[]
  correctAnswer: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  estimatedTime: number // in minutes
  questions: Question[]
}

export const quizData: Quiz[] = [
  {
    id: "hieroglyph-basics",
    title: "Hieroglyph Basics",
    description: "Test your knowledge of ancient Egyptian writing systems and symbols.",
    category: "hieroglyphs",
    difficulty: "Easy",
    estimatedTime: 5,
    questions: [
      {
        question:
          "What is the name of the ancient Egyptian writing system that uses symbols to represent sounds or ideas?",
        options: ["Cuneiform", "Hieroglyphs", "Pictograms", "Alphabets"],
        correctAnswer: "B",
      },
      {
        question: "Which of the following is a common symbol in hieroglyphics used to represent the concept of 'life'?",
        options: ["Ankh", "Djed", "Was Scepter", "Eye of Horus"],
        correctAnswer: "A",
      },
      {
        question: "In hieroglyphics, what does the direction of the symbols indicate?",
        options: [
          "The color of the object being depicted",
          "The gender of the person being referred to",
          "The direction in which the text should be read",
          "The time period when the text was written",
        ],
        correctAnswer: "C",
      },
      {
        question: "Which of the following is NOT a type of hieroglyphic symbol?",
        options: ["Ideogram", "Phonogram", "Logogram", "Numeral"],
        correctAnswer: "D",
      },
      {
        question:
          "The Rosetta Stone played a crucial role in deciphering hieroglyphics. What language was it written in alongside hieroglyphics?",
        options: ["Greek", "Latin", "Arabic", "Hebrew"],
        correctAnswer: "A",
      },
      {
        question: "How many basic types of hieroglyphic signs are there?",
        options: ["One", "Two", "Three", "Four"],
        correctAnswer: "C",
      },
      {
        question: "In hieroglyphs, what do 'determinatives' do?",
        options: [
          "Represent whole words",
          "Indicate how a word should be pronounced",
          "Show the category or meaning of a word",
          "Act as punctuation marks",
        ],
        correctAnswer: "C",
      },
      {
        question: "Which direction could hieroglyphs be written in?",
        options: [
          "Left to right only",
          "Right to left only",
          "Top to bottom only",
          "Any direction depending on space and design",
        ],
        correctAnswer: "D",
      },
      {
        question: "What does the hieroglyph of an open hand usually represent?",
        options: ["Power", "Work or action", "Peace", "Protection"],
        correctAnswer: "B",
      },
      {
        question: "Who was able to read and write hieroglyphs in ancient Egypt?",
        options: ["Everyone", "Farmers", "Priests and scribes", "Soldiers"],
        correctAnswer: "C",
      },
    ],
  },
  {
    id: "pyramid-facts",
    title: "Pyramid Facts",
    description: "Challenge yourself with advanced questions about Egyptian pyramids and their construction.",
    category: "pyramids",
    difficulty: "Hard",
    estimatedTime: 8,
    questions: [
      {
        question: "Which pyramid is the largest of the three pyramids at Giza?",
        options: ["Pyramid of Khafre", "Pyramid of Menkaure", "Great Pyramid of Khufu", "Bent Pyramid"],
        correctAnswer: "C",
      },
      {
        question: "What is the primary purpose of the pyramids built by the ancient Egyptians?",
        options: [
          "To serve as temples for worship",
          "To function as granaries for storing food",
          "To act as tombs for pharaohs",
          "To serve as astronomical observatories",
        ],
        correctAnswer: "C",
      },
      {
        question: "The Great Pyramid of Khufu is believed to have been constructed using which method?",
        options: [
          "Granite blocks floated on water",
          "Wooden ramps and levers",
          "Extraterrestrial technology",
          "Sandstone bricks molded on-site",
        ],
        correctAnswer: "B",
      },
      {
        question: "Which of the following is NOT one of the Seven Wonders of the Ancient World?",
        options: ["Pyramid of Khufu", "Hanging Gardens of Babylon", "Lighthouse of Alexandria", "Temple of Artemis"],
        correctAnswer: "A",
      },
      {
        question: "Approximately how many years ago was the Great Pyramid of Khufu constructed?",
        options: ["2,000 years ago", "4,000 years ago", "5,000 years ago", "6,000 years ago"],
        correctAnswer: "C",
      },
      {
        question: "What was the original height of the Great Pyramid of Giza when it was first completed?",
        options: ["138.8 meters", "146.6 meters", "152.5 meters", "160 meters"],
        correctAnswer: "B",
      },
      {
        question:
          "Which pyramid is known for having two different angles in its structure, giving it a 'bent' appearance?",
        options: ["Great Pyramid of Khufu", "Pyramid of Djoser", "Bent Pyramid of Sneferu", "Red Pyramid"],
        correctAnswer: "C",
      },
      {
        question: "What was the purpose of the 'air shafts' found in the Great Pyramid of Khufu?",
        options: [
          "To allow ventilation for workers during construction",
          "To align with specific stars or constellations",
          "To help reduce internal pressure",
          "To serve as escape routes for priests",
        ],
        correctAnswer: "B",
      },
      {
        question:
          "Which of the following pyramids originally had a polished limestone casing that made it shine like a gem?",
        options: ["Pyramid of Menkaure", "Pyramid of Khafre", "Step Pyramid of Djoser", "Great Pyramid of Khufu"],
        correctAnswer: "D",
      },
      {
        question: "Which modern technology has been used to discover hidden chambers inside the Great Pyramid of Giza?",
        options: ["X-ray imaging", "MRI scanning", "Cosmic-ray muon radiography", "Ultrasound mapping"],
        correctAnswer: "C",
      },
      {
        question: "What material was primarily used to build the internal chambers of pyramids?",
        options: ["Granite", "Limestone blocks", "Mud bricks", "Basalt"],
        correctAnswer: "A",
      },
      {
        question:
          "The Pyramid Texts, the oldest religious writings in the world, were first inscribed inside pyramids during which dynasty?",
        options: ["3rd Dynasty", "4th Dynasty", "5th Dynasty", "6th Dynasty"],
        correctAnswer: "C",
      },
    ],
  },
  {
    id: "daily-life",
    title: "Ancient Egyptian Daily Life",
    description: "Learn about the everyday lives of ancient Egyptians, from clothing to food and social customs.",
    category: "daily-life",
    difficulty: "Medium",
    estimatedTime: 6,
    questions: [
      {
        question: "What was the most common type of clothing worn by both men and women in ancient Egypt?",
        options: ["Tunics", "Robes", "Togas", "Saris"],
        correctAnswer: "A",
      },
      {
        question: "Which of the following animals was often kept as a pet in ancient Egyptian homes?",
        options: ["Lions", "Crocodiles", "Cats", "Elephants"],
        correctAnswer: "C",
      },
      {
        question: "What was a popular board game played by ancient Egyptians in their free time?",
        options: ["Chess", "Senet", "Backgammon", "Go"],
        correctAnswer: "B",
      },
      {
        question: "How did children typically learn a trade or profession in ancient Egypt?",
        options: [
          "By attending school",
          "By studying books",
          "By learning from family members or apprenticeships",
          "Through government training programs",
        ],
        correctAnswer: "C",
      },
      {
        question: "What was the main source of lighting inside homes at night?",
        options: ["Oil lamps", "Candles", "Fire pits", "Gas lanterns"],
        correctAnswer: "A",
      },
      {
        question: "Which of these was NOT a common job in ancient Egypt?",
        options: ["Farmer", "Scribe", "Teacher", "Blacksmith"],
        correctAnswer: "D",
      },
      {
        question: "How many days did a typical work week last in ancient Egypt?",
        options: ["5 days", "6 days", "7 days", "8 days"],
        correctAnswer: "B",
      },
      {
        question: "What was commonly used to sweeten food in ancient Egypt?",
        options: ["Sugar", "Honey", "Maple syrup", "Molasses"],
        correctAnswer: "B",
      },
      {
        question: "Which of these activities was commonly done during religious festivals in ancient Egypt?",
        options: ["Public feasting and processions", "Horse racing", "Wrestling matches", "Poetry competitions"],
        correctAnswer: "A",
      },
      {
        question: "What was a common way to preserve food in ancient Egypt due to the hot climate?",
        options: ["Freezing", "Salting and drying", "Pickling in vinegar", "Storing in iceboxes"],
        correctAnswer: "B",
      },
    ],
  },
]
