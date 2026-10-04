/* =========================================================
   KGKHS - AUTOMATIC FOLDER ICON ENGINE
   One common icon system for:
   1. NEVER MISS TO KNOW
   2. SCHOOL FILE UPLOAD
   ========================================================= */

(function () {

    window.KGKHSFolderIcons = {

        getIcon: function (folderName) {

            const key = String(folderName || "")
                .toLowerCase()
                .trim()
                .replace(/[_\s]+/g, "-")
                .replace(/-+/g, "-");

            /* -----------------------------------------
               EXACT / MAIN SCHOOL CATEGORIES
               ----------------------------------------- */

            const exact = {

                "notices": "📢",
                "examinations": "📝",
                "exam-messages": "📨",
                "programs": "🎉",
                "programmes": "🎉",
                "events": "📅",
                "upcoming-events": "🔔",

                "celebrations": "🎊",
                "celebration": "🎊",

                "holidays": "🏖️",

                "sports": "🏆",
                "annual-sports": "🏆",

                "drill": "🥁",
                "functions": "🎭",
                "games": "🎮",
                "dances": "💃",

                "gallery": "🖼️",
                "admission": "📋",

                "suravi": "🎪",
                "sishu-utsav": "🎈",

                "national-day": "🇮🇳",
                "national-days": "🇮🇳",
                "observe": "👀",

                "students-creations": "👨‍🎓",
                "teachers-creations": "👩‍🏫",

                "school-magazine": "📖",
                "student-magazine": "📚",
                "teacher-articles": "✍️",

                "student-achievements": "🥇",
                "staff-achievements": "🏅",
                "awards": "🏆",
                "certificates": "📜",

                "results": "📊",
                "results-marks": "📊",

                "academic-materials": "📚",
                "study-materials": "📖",
                "textbooks": "📘",
                "question-papers": "📄",
                "model-questions": "❓",
                "homework": "📒",
                "assignments": "📒",
                "projects": "🔬",

                "science-activities": "🧪",
                "mathematics-activities": "➗",
                "language-activities": "🗣️",
                "art-craft": "🎨",

                "cultural-activities": "🎭",
                "eco-club": "🌱",
                "environment": "🌱",

                "scouts-guides": "🏕️",
                "ncc": "🫡",
                "nss": "🫡",

                "health-awareness": "❤️",
                "community-activities": "🤝",

                "educational-tours": "🚌",
                "excursions": "🚌",
                "field-trips": "🌍",

                "alumni": "👥",
                "parents": "👨‍👩‍👧",
                "pta": "🤝",

                "hm-messages": "👨‍🏫",
                "teacher-messages": "👩‍🏫",

                "school-history": "🏫",
                "school-development": "🏗️",
                "infrastructure": "🏢",

                "library": "📚",
                "hostel": "🛏️",

                "computer": "💻",
                "computer-activities": "💻",
                "ict": "💻",
                "digital-learning": "🖥️",

                "donations": "🤝",
                "contributions": "🤝",
                "wantings": "🙏",
                "donor-contributions": "❤️",
        "school-kitchen": "🍳",
     "kitchen": "🍳",
     "garden": "🌳",
     "school-garden": "🌳",
     "batika": "🧵",
     "playground": "⚽",
    "school-playground": "⚽",
    "common-room": "🏠",
    "common-room-bcr": "🏠",
    "bcr": "🏠",
    "gcr": "🏠",
    "hm-office": "🏢",
    "hm-office-room": "🏢",
     "yoga": "🧘",
       "yoga-room": "🧘",
                "important-documents": "📂",
                "other-documents": "📄"
            };


            if (exact[key]) {
                return exact[key];
            }


            /* -----------------------------------------
               AUTOMATIC KEYWORD DETECTION
               For completely new folders
               ----------------------------------------- */

            const rules = [

                {
                    words: [
                        "football",
                        "cricket",
                        "volleyball",
                        "basketball",
                        "badminton",
                        "athletics",
                        "tournament"
                    ],
                    icon: "⚽"
                },

                {
                    words: [
                        "science",
                        "laboratory",
                        "lab",
                        "experiment",
                        "exhibition"
                    ],
                    icon: "🧪"
                },

                {
                    words: [
                        "innovation",
                        "invention",
                        "idea",
                        "startup"
                    ],
                    icon: "💡"
                },

                {
                    words: [
                        "drawing",
                        "painting",
                        "art",
                        "craft"
                    ],
                    icon: "🎨"
                },

                {
                    words: [
                        "music",
                        "song",
                        "singing"
                    ],
                    icon: "🎵"
                },

                {
                    words: [
                        "dance",
                        "dancing"
                    ],
                    icon: "💃"
                },

                {
                    words: [
                        "book",
                        "books",
                        "reading",
                        "library"
                    ],
                    icon: "📚"
                },

                {
                    words: [
                        "computer",
                        "technology",
                        "digital",
                        "ict"
                    ],
                    icon: "💻"
                },

                {
                    words: [
                        "tree",
                        "plant",
                        "plantation",
                        "environment",
                        "green",
                        "eco"
                    ],
                    icon: "🌱"
                },

                {
                    words: [
                        "tour",
                        "trip",
                        "excursion",
                        "visit"
                    ],
                    icon: "🚌"
                },

                {
                    words: [
                        "achievement",
                        "achievements",
                        "success"
                    ],
                    icon: "🥇"
                },

                {
                    words: [
                        "award",
                        "awards",
                        "prize"
                    ],
                    icon: "🏆"
                },

                {
                    words: [
                        "certificate",
                        "certificates"
                    ],
                    icon: "📜"
                },

                {
                    words: [
                        "independence",
                        "republic",
                        "national"
                    ],
                    icon: "🇮🇳"
                },

                {
                    words: [
                        "student",
                        "students",
                        "pupil",
                        "pupils"
                    ],
                    icon: "👨‍🎓"
                },

                {
                    words: [
                        "teacher",
                        "teachers",
                        "staff"
                    ],
                    icon: "👩‍🏫"
                },

                {
                    words: [
                        "parent",
                        "parents",
                        "pta"
                    ],
                    icon: "👨‍👩‍👧"
                },

                {
                    words: [
                        "alumni"
                    ],
                    icon: "👥"
                },

                {
                    words: [
                        "building",
                        "school-building",
                        "infrastructure",
                        "construction"
                    ],
                    icon: "🏫"
                },

                {
                    words: [
                        "health",
                        "medical",
                        "awareness"
                    ],
                    icon: "❤️"
                },

                {
                    words: [
                        "donation",
                        "donations",
                        "contribution",
                        "contributions"
                    ],
                    icon: "🤝"
                },

                {
                    words: [
                        "magazine",
                        "journal"
                    ],
                    icon: "📖"
                },

                {
                    words: [
                        "result",
                        "results",
                        "marks"
                    ],
                    icon: "📊"
                },

                {
                    words: [
                        "exam",
                        "examination",
                        "question",
                        "questions"
                    ],
                    icon: "📝"
                },

                {
                    words: [
                        "holiday",
                        "holidays"
                    ],
                    icon: "🏖️"
                },

                {
                    words: [
                        "celebration",
                        "celebrations",
                        "festival",
                        "festivals"
                    ],
                    icon: "🎊"
                },

                {
                    words: [
                        "event",
                        "events",
                        "programme",
                        "program",
                        "function"
                    ],
                    icon: "🎉"
                }
            ];


            for (let i = 0; i < rules.length; i++) {

                for (let j = 0; j < rules[i].words.length; j++) {

                    const word =
                        rules[i].words[j].toLowerCase();

                    if (
                        key === word ||
                        key.indexOf(word + "-") === 0 ||
                        key.indexOf("-" + word) !== -1 ||
                        key.indexOf(word) !== -1
                    ) {
                        return rules[i].icon;
                    }
                }
            }


            /* -----------------------------------------
               UNKNOWN FOLDER
               ----------------------------------------- */

           // Smart icon for completely new folders
const smartIcons = [
    "📂",
    "🗂️",
    "📁",
    "🗃️",
    "🗄️",
    "📚",
    "🧰",
    "🧾"
];

let iconIndex = 0;

for (let i = 0; i < key.length; i++) {
    iconIndex = (iconIndex + key.charCodeAt(i)) % smartIcons.length;
}

return smartIcons[iconIndex];
        },


        formatName: function (folderName) {

            return String(folderName || "")
                .replace(/[-_]+/g, " ")
                .replace(/\b\w/g, function (letter) {
                    return letter.toUpperCase();
                });
        }

    };

})();
