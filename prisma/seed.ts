import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting FaithVerse comprehensive database seeding...");

  // Clean existing data
  await prisma.moderationAuditLog.deleteMany();
  await prisma.moderationReview.deleteMany();
  await prisma.report.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.prayerInteraction.deleteMany();
  await prisma.prayerRequest.deleteMany();
  await prisma.commentReply.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.savedPost.deleteMany();
  await prisma.postHashtag.deleteMany();
  await prisma.hashtag.deleteMany();
  await prisma.postMedia.deleteMany();
  await prisma.post.deleteMany();
  await prisma.video.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.story.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationMember.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.churchMember.deleteMany();
  await prisma.church.deleteMany();
  await prisma.dailyVerse.deleteMany();
  await prisma.audioTrack.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  const superAdmin = await prisma.user.create({
    data: {
      email: "admin@faithverse.org",
      username: "faithverse_admin",
      fullName: "FaithVerse Administrator",
      role: "SUPER_ADMIN",
      isVerified: true,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Chief Moderation & Community Guardian at FaithVerse. Committed to truth, grace, and purposeful connection.",
      location: "Global Sanctuary",
      religion: "Christian",
      settings: {
        create: {
          preferredLanguage: "en",
          theme: "dark",
        },
      },
    },
  });

  const moderator = await prisma.user.create({
    data: {
      email: "moderator@faithverse.org",
      username: "sarah_mod",
      fullName: "Sarah Jenkins",
      role: "MODERATOR",
      isVerified: true,
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      bio: "Community Moderator. Ensuring uplifting, respectful, and faith-honoring conversations for everyone.",
      location: "Toronto, Canada",
      religion: "Christian",
      settings: {
        create: {
          preferredLanguage: "en",
          theme: "dark",
        },
      },
    },
  });

  const pastorJohn = await prisma.user.create({
    data: {
      email: "pastor.john@gracechurch.org",
      username: "pastor_john",
      fullName: "Pastor John Mathew",
      role: "USER",
      isVerified: true,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80",
      bio: "Lead Pastor at Grace Fellowship. Passionate about expository preaching, grace, and encouraging believers worldwide.",
      location: "Bengaluru, India",
      religion: "Christian",
      settings: {
        create: {
          preferredLanguage: "en",
          theme: "dark",
        },
      },
    },
  });

  const rachelWorship = await prisma.user.create({
    data: {
      email: "rachel.music@faithverse.org",
      username: "rachel_worship",
      fullName: "Rachel Vance",
      role: "USER",
      isVerified: true,
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
      bio: "Worship leader & songwriter. Creating music that leads hearts into His sacred presence. 🎵✨",
      location: "Nashville, TN",
      religion: "Christian",
      settings: {
        create: {
          preferredLanguage: "en",
          theme: "dark",
        },
      },
    },
  });

  const davidSeeker = await prisma.user.create({
    data: {
      email: "david.seeker@gmail.com",
      username: "david_seeker",
      fullName: "David Chen",
      role: "USER",
      isVerified: false,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      bio: "Tech enthusiast on a journey of discovering purpose, ethics, and ancient wisdom. All faiths and questions welcome.",
      location: "San Francisco, CA",
      religion: "Explorer / Open",
      settings: {
        create: {
          preferredLanguage: "en",
          theme: "dark",
        },
      },
    },
  });

  const priyaGrace = await prisma.user.create({
    data: {
      email: "priya.grace@faithverse.org",
      username: "priya_grace",
      fullName: "Priya Sharma",
      role: "USER",
      isVerified: true,
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      bio: "Joyful follower of Jesus. Lover of morning devotionals and community outreach. ಕನ್ನಡ / हिंदी / English.",
      location: "Mysuru, India",
      religion: "Christian",
      settings: {
        create: {
          preferredLanguage: "kn",
          theme: "dark",
        },
      },
    },
  });

  // 2. Create Hashtags
  const tags = await Promise.all([
    prisma.hashtag.create({ data: { tag: "BibleStudy", postCount: 24 } }),
    prisma.hashtag.create({ data: { tag: "GraceUnbounded", postCount: 18 } }),
    prisma.hashtag.create({ data: { tag: "WorshipTogether", postCount: 35 } }),
    prisma.hashtag.create({ data: { tag: "PrayerRequest", postCount: 42 } }),
    prisma.hashtag.create({ data: { tag: "DailyVerse", postCount: 50 } }),
    prisma.hashtag.create({ data: { tag: "FaithJourney", postCount: 19 } }),
  ]);

  // 3. Create Posts (Approved and Pending Moderation)
  // APPROVED POST 1 - Pastor John
  const post1 = await prisma.post.create({
    data: {
      authorId: pastorJohn.id,
      content: "When storms rage around you, remember that the Anchor of your soul holds firm. Peace is not the absence of trouble; it is the presence of God in the midst of it. Rest in Matthew 11:28 today: 'Come to me, all who are weary and burdened, and I will give you rest.' 🙏✨ #GraceUnbounded #BibleStudy",
      postType: "PHOTO",
      category: "BIBLE_TEACHING",
      moderationStatus: "APPROVED",
      publishedAt: new Date(Date.now() - 3600000 * 4),
      media: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1200&q=80",
            mediaType: "IMAGE",
            aspectRatio: "16:9",
            altText: "Open Bible on rustic wooden table with morning light",
          },
        ],
      },
      likes: {
        create: [
          { userId: rachelWorship.id },
          { userId: davidSeeker.id },
          { userId: priyaGrace.id },
        ],
      },
      comments: {
        create: [
          {
            userId: davidSeeker.id,
            content: "Needed this reminder today. Sometimes the noise of life makes it hard to remember stillness.",
            replies: {
              create: [
                {
                  userId: pastorJohn.id,
                  content: "Standing with you in prayer, David! He meets you right where you are.",
                },
              ],
            },
          },
          {
            userId: priyaGrace.id,
            content: "Amen pastor! Truly an anchor for our souls in uncertain times.",
          },
        ],
      },
    },
  });

  // APPROVED POST 2 - Rachel Worship
  const post2 = await prisma.post.create({
    data: {
      authorId: rachelWorship.id,
      content: "Recording late nights in the studio... There's something sacred about writing words straight from the Psalms. Can't wait to share our new worship anthem 'Living Water' with the FaithVerse family next week! 🕊️🎶 #WorshipTogether",
      postType: "PHOTO",
      category: "WORSHIP_MUSIC",
      moderationStatus: "APPROVED",
      publishedAt: new Date(Date.now() - 3600000 * 8),
      media: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
            mediaType: "IMAGE",
            aspectRatio: "4:5",
            altText: "Worship session in music studio with warm glowing lights",
          },
        ],
      },
      likes: {
        create: [
          { userId: pastorJohn.id },
          { userId: priyaGrace.id },
        ],
      },
    },
  });

  // APPROVED POST 3 - Priya Grace (Multi-lingual Testimony)
  const post3 = await prisma.post.create({
    data: {
      authorId: priyaGrace.id,
      content: "Testimony of healing: Last month my mother was admitted with severe complications. We prayed here on the FaithVerse Prayer Wall, and so many of you interceded for her. Today the doctors gave her an all-clear report! God is faithful in every season. 'ಯೆಹೋವನೇ ನನ್ನ ಬೆಳಕೂ ರಕ್ಷಣೆಯೂ ಆಗಿದ್ದಾನೆ' (Psalm 27:1) 🙌 #FaithJourney #PrayerRequest",
      postType: "PHOTO",
      category: "TESTIMONY",
      moderationStatus: "APPROVED",
      publishedAt: new Date(Date.now() - 3600000 * 12),
      media: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
            mediaType: "IMAGE",
            aspectRatio: "16:9",
            altText: "Breathtaking mountain sunrise symbolizing hope and new beginnings",
          },
        ],
      },
      likes: {
        create: [
          { userId: pastorJohn.id },
          { userId: rachelWorship.id },
          { userId: davidSeeker.id },
          { userId: moderator.id },
        ],
      },
    },
  });

  // PENDING POST 1 - David Seeker (Awaiting Admin Review)
  await prisma.post.create({
    data: {
      authorId: davidSeeker.id,
      content: "As someone who didn't grow up in a church, reading the Sermon on the Mount has been deeply convicting. The concept of loving your enemies and praying for those who persecute you feels radically counter-cultural in 2026. What books or commentaries would you recommend for exploring this deeper?",
      postType: "TEXT",
      category: "COMMUNITY",
      moderationStatus: "PENDING",
      createdAt: new Date(Date.now() - 1800000), // 30 mins ago
    },
  });

  // PENDING POST 2 - Youth Group outreach (Awaiting Admin Review)
  await prisma.post.create({
    data: {
      authorId: priyaGrace.id,
      content: "Youth Community Food Drive update! We packed 450 meals for families in need around the city center. Serving with joyful hands! Check out the team photo from today's mission. 🍲❤️ #GraceUnbounded",
      postType: "PHOTO",
      category: "INSPIRATION",
      moderationStatus: "PENDING",
      createdAt: new Date(Date.now() - 900000), // 15 mins ago
      media: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
            mediaType: "IMAGE",
            aspectRatio: "16:9",
            altText: "Community volunteers distributing food and smiling",
          },
        ],
      },
    },
  });

  // NEEDS_CHANGES POST - Pastor John
  await prisma.post.create({
    data: {
      authorId: pastorJohn.id,
      content: "Announcing special conference tickets link! Please make sure to bring ID. Note: external ticketing link requires update.",
      postType: "TEXT",
      category: "EDUCATION",
      moderationStatus: "NEEDS_CHANGES",
      needsChangesNote: "Please update the post to include verified contact info for the event coordinators according to section 6 guidelines.",
      createdAt: new Date(Date.now() - 7200000),
    },
  });

  // REJECTED POST (For Audit Logs and Status Display)
  const rejectedPost = await prisma.post.create({
    data: {
      authorId: davidSeeker.id,
      content: "Unverified commercial crypto promotion disguised as fundraising.",
      postType: "TEXT",
      category: "COMMUNITY",
      moderationStatus: "REJECTED",
      rejectionReason: "Violation of Community Standard 4.2: Commercial solicitations, unauthorized token sales, and spam are prohibited on FaithVerse.",
      createdAt: new Date(Date.now() - 86400000),
    },
  });

  // Record Moderation Audit Log for rejected post
  await prisma.moderationReview.create({
    data: {
      postId: rejectedPost.id,
      reviewerId: moderator.id,
      action: "REJECT",
      reason: "Spam / Unauthorized commercial solicitation",
      internalNotes: "Flagged by automatic keyword filter and confirmed by moderator.",
    },
  });

  await prisma.moderationAuditLog.create({
    data: {
      adminId: moderator.id,
      action: "REJECT_POST",
      targetEntity: "POST",
      targetId: rejectedPost.id,
      details: "Rejected post due to commercial spam policy violation.",
    },
  });

  // 4. Create Daily Bible Verse (English, Kannada, Hindi)
  const todayStr = new Date().toISOString().split("T")[0];
  await prisma.dailyVerse.create({
    data: {
      dateString: todayStr,
      book: "Philippians",
      chapter: 4,
      verse: 6,
      textEnglish: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
      textKannada: "ಯಾವ ವಿಷಯದ ಚಿಂತೆಯೂ ಇಲ್ಲದೆ, ಎಲ್ಲಾದರಲ್ಲೂ ಕೃತಜ್ಞತಾಸ್ತುತಿಯೊಂದಿಗೆ ನಿಮ್ಮ ಬಿನ್ನಹಗಳನ್ನು ಪ್ರಾರ್ಥನೆಯಿಂದಲೂ ಯಾಚನೆಯಿಂದಲೂ ದೇವರಿಗೆ ತಿಳಿಯಪಡಿಸಿರಿ.",
      textHindi: "किसी भी बात की चिन्ता मत करो; परन्तु हर एक बात में तुम्हारे निवेदन, प्रार्थना और याचना के द्वारा धन्यवाद के साथ परमेश्वर के सम्मुख उपस्थित किए जाएं।",
      explanation: "Paul wrote these enduring words from a Roman prison cell. Even in confinement, he experienced the supernatural peace of God by exchanging human worry for prayerful thanksgiving. Whenever anxiety knocks on your heart today, redirect it into prayer.",
      theme: "Peace in Every Season",
    },
  });

  // 5. Create Prayer Wall Requests
  const prayer1 = await prisma.prayerRequest.create({
    data: {
      authorId: davidSeeker.id,
      title: "Guidance in career transition & peace of mind",
      description: "I am facing an unexpected layoff and transitioning into a new industry. Asking for God's clear direction, wisdom for interviews, and peace for my family during this season.",
      isAnonymous: false,
      isPrivate: false,
      isAnswered: false,
      prayerCount: 14,
      interactions: {
        create: [
          { userId: pastorJohn.id },
          { userId: rachelWorship.id },
          { userId: priyaGrace.id },
          { userId: moderator.id },
        ],
      },
    },
  });

  const prayer2 = await prisma.prayerRequest.create({
    data: {
      authorId: priyaGrace.id,
      title: "Praise Report! Complete healing for my mother",
      description: "Last week we asked for prayers for my mother's cardiac surgery. Today she came home with clean reports and strong vitals. Thank you FaithVerse family for standing in the gap with us!",
      isAnonymous: false,
      isPrivate: false,
      isAnswered: true,
      answeredNotes: "Answered on October 29: Full recovery and released from ICU!",
      prayerCount: 38,
      interactions: {
        create: [
          { userId: pastorJohn.id },
          { userId: davidSeeker.id },
        ],
      },
    },
  });

  // 6. Create Churches
  await prisma.church.create({
    data: {
      name: "Grace Fellowship International",
      denomination: "Non-Denominational / Evangelical",
      description: "A Christ-centered, Bible-believing family church located in the heart of the city, passionate about global missions and local discipleship.",
      address: "88 Indiranagar Main Road",
      city: "Bengaluru",
      country: "India",
      phone: "+91 80 2525 0199",
      email: "info@gracefellowship.org",
      website: "https://gracefellowship.org",
      liveStreamUrl: "https://www.youtube.com/watch?v=live-demo",
      serviceTimes: "Sunday: 8:30 AM (English), 10:30 AM (Bilingual); Wednesday Prayer: 7:00 PM",
      isVerified: true,
      avatarUrl: "https://images.unsplash.com/photo-1548625361-16eb16111003?auto=format&fit=crop&w=400&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80",
    },
  });

  await prisma.church.create({
    data: {
      name: "Hope Cathedral Mumbai",
      denomination: "Protestant / Anglican",
      description: "Historic sanctuary open for daily prayer, contemplative worship, and serving Mumbai's poorest neighborhoods with unconditional love.",
      address: "12 Fort Heritage Precinct",
      city: "Mumbai",
      country: "India",
      phone: "+91 22 2266 4000",
      email: "contact@hopecathedral.in",
      website: "https://hopecathedral.in",
      serviceTimes: "Sunday: 9:00 AM (Traditional Liturgy), 6:00 PM (Contemporary Worship)",
      isVerified: true,
      avatarUrl: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=400&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=1200&q=80",
    },
  });

  // 7. Create Christian Events
  const nextMonth = new Date(Date.now() + 86400000 * 14);
  await prisma.event.create({
    data: {
      title: "Global Worship Night 2026",
      description: "An evening of unified praise, prayer for the nations, and intimate acoustic worship led by Rachel Vance and guest worship leaders.",
      category: "WORSHIP_NIGHT",
      location: "Bengaluru City Arena & Worldwide Online Stream",
      isOnline: true,
      streamUrl: "https://faithverse.org/live/worship2026",
      startDate: nextMonth,
      endDate: new Date(nextMonth.getTime() + 14400000),
      bannerUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    },
  });

  await prisma.event.create({
    data: {
      title: "Faith & Technology Summit",
      description: "Exploring ethical AI, modern gospel digital distribution, and tech discipleship with global Christian technologists and thinkers.",
      category: "CONFERENCE",
      location: "San Francisco Innovation Hub & FaithVerse Virtual Stage",
      isOnline: true,
      startDate: new Date(Date.now() + 86400000 * 25),
      endDate: new Date(Date.now() + 86400000 * 27),
      bannerUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    },
  });

  // 8. Create Audio Tracks / Worship & Podcasts
  await prisma.audioTrack.create({
    data: {
      title: "Living Water (Acoustic Sanctuary)",
      artist: "Rachel Vance",
      album: "Sacred Presence EP",
      category: "WORSHIP",
      durationSeconds: 274,
      audioUrl: "https://actions.google.com/sounds/v1/water/rain_heavy.ogg", // standard public audio preview
      coverArtUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
      lyrics: "Like a dry land longing for rain / Let Your living water flow again...",
      playsCount: 1420,
    },
  });

  await prisma.audioTrack.create({
    data: {
      title: "Walking in Divine Peace | Episode 42",
      artist: "Pastor John Mathew",
      album: "Grace for Today Podcast",
      category: "SERMON_PODCAST",
      durationSeconds: 980,
      audioUrl: "https://actions.google.com/sounds/v1/ambiences/humming_room_tone.ogg",
      coverArtUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
      playsCount: 3890,
    },
  });

  // 9. Create Short Videos / Reels
  await prisma.video.create({
    data: {
      authorId: rachelWorship.id,
      title: "Behind the lyrics: Psalm 23 at sunset 🌅 #Worship #Peace",
      description: "When the evening comes, take 30 seconds to breathe in His goodness.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      videoType: "REEL",
      durationSeconds: 28,
      viewCount: 1540,
      likesCount: 312,
      moderationStatus: "APPROVED",
    },
  });

  await prisma.video.create({
    data: {
      authorId: pastorJohn.id,
      title: "3 Words to start your morning with clarity 📖",
      description: "Trust. Surrender. Follow. How to align your mindset before checking your phone.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80",
      videoType: "REEL",
      durationSeconds: 45,
      viewCount: 2890,
      likesCount: 521,
      moderationStatus: "APPROVED",
    },
  });

  // 10. Stories
  await prisma.story.create({
    data: {
      userId: rachelWorship.id,
      mediaUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
      caption: "Soundcheck in Bengaluru! So excited for tonight. ✨",
      moderationStatus: "APPROVED",
      expiresAt: new Date(Date.now() + 86400000),
    },
  });

  await prisma.story.create({
    data: {
      userId: pastorJohn.id,
      mediaUrl: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&q=80",
      caption: "Morning sunrise prayer walk. Praying for peace across our world today.",
      moderationStatus: "APPROVED",
      expiresAt: new Date(Date.now() + 86400000),
    },
  });

  console.log("✅ FaithVerse database seeded successfully with users, approved & pending posts, daily verse, prayers, and media!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
