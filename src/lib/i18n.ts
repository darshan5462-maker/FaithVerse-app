export type SupportedLanguage = "en" | "kn" | "hi";

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    home: string;
    explore: string;
    reels: string;
    videos: string;
    create: string;
    messages: string;
    bible: string;
    prayers: string;
    testimonies: string;
    churches: string;
    events: string;
    audio: string;
    admin: string;
    profile: string;
    notifications: string;
    settings: string;
  };
  feed: {
    forYou: string;
    following: string;
    trending: string;
    latest: string;
    createPrompt: string;
    like: string;
    comment: string;
    share: string;
    save: string;
    report: string;
    prayed: string;
    verifiedBadge: string;
    pendingNotice: string;
  };
  dailyVerse: {
    title: string;
    reflection: string;
    shareVerse: string;
    bookmark: string;
    viewInBible: string;
  };
  prayerWall: {
    title: string;
    subtitle: string;
    submitRequest: string;
    iPrayed: string;
    answeredPrayers: string;
    anonymous: string;
    activePrayers: string;
  };
  moderation: {
    badgePending: string;
    badgeApproved: string;
    badgeRejected: string;
    badgeNeedsChanges: string;
    adminQueue: string;
    approve: string;
    reject: string;
    requestChanges: string;
  };
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    appName: "FaithVerse",
    tagline: "Scroll with Purpose. Share with Love. Grow Together.",
    nav: {
      home: "Home",
      explore: "Explore",
      reels: "Reels",
      videos: "Teachings",
      create: "Create",
      messages: "Messages",
      bible: "Bible Reader",
      prayers: "Prayer Wall",
      testimonies: "Testimonies",
      churches: "Churches",
      events: "Events",
      audio: "Audio & Worship",
      admin: "Admin Hub",
      profile: "Profile",
      notifications: "Notifications",
      settings: "Settings",
    },
    feed: {
      forYou: "For You",
      following: "Following",
      trending: "Trending",
      latest: "Latest",
      createPrompt: "Share an encouraging thought, Bible verse, or testimony...",
      like: "Like",
      comment: "Comment",
      share: "Share",
      save: "Save",
      report: "Report",
      prayed: "Prayed",
      verifiedBadge: "Verified Faith Community",
      pendingNotice: "Post submitted for approval. It will become visible once reviewed by a moderator.",
    },
    dailyVerse: {
      title: "Daily Scripture",
      reflection: "Spiritual Reflection",
      shareVerse: "Share Verse",
      bookmark: "Bookmark",
      viewInBible: "Read Chapter",
    },
    prayerWall: {
      title: "Community Prayer Wall",
      subtitle: "Cast your cares upon the Lord. Thousands are standing with you in prayer.",
      submitRequest: "Submit Prayer Request",
      iPrayed: "I Prayed for This",
      answeredPrayers: "Answered Prayers",
      anonymous: "Submit Anonymously",
      activePrayers: "Active Petitions",
    },
    moderation: {
      badgePending: "Pending Review",
      badgeApproved: "Approved",
      badgeRejected: "Rejected",
      badgeNeedsChanges: "Needs Changes",
      adminQueue: "Moderation Queue",
      approve: "Approve Post",
      reject: "Reject Post",
      requestChanges: "Request Changes",
    },
  },
  kn: {
    appName: "ಫೇತ್‌ವರ್ಸ್ (FaithVerse)",
    tagline: "ಉದ್ದೇಶದೊಂದಿಗೆ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ. ಪ್ರೀತಿಯಿಂದ ಹಂಚಿಕೊಳ್ಳಿ. ಒಟ್ಟಾಗಿ ಬೆಳೆಯಿರಿ.",
    nav: {
      home: "ಮುಖಪುಟ",
      explore: "ಅನ್ವೇಷಿಸಿ",
      reels: "ರೀಲ್ಸ್",
      videos: "ಬೋಧನೆಗಳು",
      create: "ರಚಿಸಿ",
      messages: "ಸಂದೇಶಗಳು",
      bible: "ಬೈಬಲ್ ವಾಚನ",
      prayers: "ಪ್ರಾರ್ಥನಾ ಗೋಡೆ",
      testimonies: "ಸಾಕ್ಷ್ಯಗಳು",
      churches: "ಚರ್ಚ್‌ಗಳು",
      events: "ಕಾರ್ಯಕ್ರಮಗಳು",
      audio: "ಆರಾಧನೆ ಮತ್ತು ಆಡಿಯೋ",
      admin: "ನಿರ್ವಾಹಕ ಕೇಂದ್ರ",
      profile: "ಪ್ರೊಫೈಲ್",
      notifications: "ಸೂಚನೆಗಳು",
      settings: "ಸಂಯೋಜನೆಗಳು",
    },
    feed: {
      forYou: "ನಿಮಗಾಗಿ",
      following: "ಹಿಂಬಾಲಿಸುತ್ತಿರುವಿರಿ",
      trending: "ಟ್ರೆಂಡಿಂಗ್",
      latest: "ಇತ್ತೀಚಿನವು",
      createPrompt: "ಉತ್ಸಾಹದ ಮಾತು, ಬೈಬಲ್ ವಾಕ್ಯ ಅಥವಾ ಸಾಕ್ಷ್ಯವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ...",
      like: "ಇಷ್ಟ",
      comment: "ಅಭಿಪ್ರಾಯ",
      share: "ಹಂಚಿಕೊಳ್ಳಿ",
      save: "ಉಳಿಸಿ",
      report: "ವರದಿ ಮಾಡಿ",
      prayed: "ಪ್ರಾರ್ಥಿಸಿದೆ",
      verifiedBadge: "ಪರಿಶೀಲಿಸಿದ ನಂಬಿಕೆಯ ಸಮುದಾಯ",
      pendingNotice: "ಪರಿಶೀಲನೆಗಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ. ಮಾಡರೇಟರ್ ಅನುಮೋದಿಸಿದ ನಂತರ ಸಾರ್ವಜನಿಕವಾಗಿ ಗೋಚರಿಸುತ್ತದೆ.",
    },
    dailyVerse: {
      title: "ದೈನಂದಿನ ವಾಕ್ಯ",
      reflection: "ಆತ್ಮೀಕ ಧ್ಯಾನ",
      shareVerse: "ವಾಕ್ಯ ಹಂಚಿಕೊಳ್ಳಿ",
      bookmark: "ಬುಕ್‌ಮಾರ್ಕ್",
      viewInBible: "ಅಧ್ಯಾಯ ಓದಿ",
    },
    prayerWall: {
      title: "ಪ್ರಾರ್ಥನಾ ಗೋಡೆ",
      subtitle: "ನಿಮ್ಮ ಚಿಂತೆಗಳನ್ನು ಕರ್ತನ ಮೇಲೆ ಇಡಿ. ಅನೇಕರು ನಿಮಗಾಗಿ ಪ್ರಾರ್ಥಿಸುತ್ತಿದ್ದಾರೆ.",
      submitRequest: "ಪ್ರಾರ್ಥನಾ ಕೋರಿಕೆ ಸಲ್ಲಿಸಿ",
      iPrayed: "ನಾನು ಪ್ರಾರ್ಥಿಸಿದೆ",
      answeredPrayers: "ಉತ್ತರಿಸಲಾದ ಪ್ರಾರ್ಥನೆಗಳು",
      anonymous: "ಅನಾಮಧೇಯವಾಗಿ ಸಲ್ಲಿಸಿ",
      activePrayers: "ಸಕ್ರಿಯ ಪ್ರಾರ್ಥನೆಗಳು",
    },
    moderation: {
      badgePending: "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ",
      badgeApproved: "ಅನುಮೋದಿಸಲಾಗಿದೆ",
      badgeRejected: "ತಿರಸ್ಕರಿಸಲಾಗಿದೆ",
      badgeNeedsChanges: "ಬದಲಾವಣೆ ಅಗತ್ಯವಿದೆ",
      adminQueue: "ಮಾಡರೇಶನ್ ಸರತಿ ಸಾಲು",
      approve: "ಅನುಮೋದಿಸಿ",
      reject: "ತಿರಸ್ಕರಿಸಿ",
      requestChanges: "ಬದಲಾವಣೆಯನ್ನು ಕೋರಿ",
    },
  },
  hi: {
    appName: "फेथवर्स (FaithVerse)",
    tagline: "उद्देश्य के साथ स्क्रॉल करें। प्रेम से साझा करें। साथ मिलकर बढ़ें।",
    nav: {
      home: "होम",
      explore: "खोजें",
      reels: "रील्स",
      videos: "शिक्षाएं",
      create: "नया बनाएं",
      messages: "संदेश",
      bible: "बाइबिल अध्ययन",
      prayers: "प्रार्थना दीवार",
      testimonies: "गवाहियां",
      churches: "चर्च डायरेक्टरी",
      events: "कार्यक्रम",
      audio: "आराधना व संगीत",
      admin: "एडमिन हब",
      profile: "प्रोफ़ाइल",
      notifications: "सूचनाएं",
      settings: "सेटिंग्स",
    },
    feed: {
      forYou: "आपके लिए",
      following: "फॉलोइंग",
      trending: "ट्रेंडिंग",
      latest: "नवीनतम",
      createPrompt: "कोई प्रेरणादायक विचार, बाइबिल वचन या गवाही साझा करें...",
      like: "पसंद",
      comment: "टिप्पणी",
      share: "साझा करें",
      save: "सहेजें",
      report: "रिपोर्ट करें",
      prayed: "प्रार्थना की",
      verifiedBadge: "सत्यापित विश्वास समुदाय",
      pendingNotice: "समीक्षा के लिए सबमिट किया गया। मॉडरेटर द्वारा स्वीकृत होने के बाद दिखाई देगा।",
    },
    dailyVerse: {
      title: "आज का पवित्र वचन",
      reflection: "आत्मिक विचार",
      shareVerse: "वचन साझा करें",
      bookmark: "बुकमार्क",
      viewInBible: "पूरा अध्याय पढ़ें",
    },
    prayerWall: {
      title: "सामुदायिक प्रार्थना दीवार",
      subtitle: "अपनी सब चिंताओं को प्रभु पर डाल दें, वह आपका ध्यान रखता है।",
      submitRequest: "प्रार्थना निवेदन भेजें",
      iPrayed: "मैंने प्रार्थना की",
      answeredPrayers: "उत्तर मिली प्रार्थनाएं",
      anonymous: "गुमनाम भेजें",
      activePrayers: "सक्रिय प्रार्थनाएं",
    },
    moderation: {
      badgePending: "समीक्षा लंबित",
      badgeApproved: "स्वीकृत",
      badgeRejected: "अस्वीकृत",
      badgeNeedsChanges: "परिवर्तन आवश्यक",
      adminQueue: "मॉडरेशन कतार",
      approve: "स्वीकृत करें",
      reject: "अस्वीकार करें",
      requestChanges: "परिवर्तन का अनुरोध",
    },
  },
};
