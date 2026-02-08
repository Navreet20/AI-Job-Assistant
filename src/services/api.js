// Mock AI API Service Layer
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate AI processing steps for progressive loading
export const analyzeResumeWithSteps = async (file, onStep) => {
  const steps = [
    { message: "Parsing resume content...", progress: 20 },
    { message: "Identifying key skills...", progress: 40 },
    { message: "Comparing with job requirements...", progress: 60 },
    { message: "Calculating match score...", progress: 80 },
    { message: "Generating recommendations...", progress: 100 }
  ];

  for (let step of steps) {
    await delay(800);
    onStep(step);
  }

  // Return mock analysis result
  return {
    score: Math.floor(Math.random() * (95 - 65) + 65),
    breakdown: {
      skillsMatch: Math.floor(Math.random() * (100 - 70) + 70),
      experienceMatch: Math.floor(Math.random() * (100 - 60) + 60),
      educationMatch: Math.floor(Math.random() * (100 - 80) + 80),
      keywordsMatch: Math.floor(Math.random() * (100 - 50) + 50)
    },
    suggestions: [
      { 
        id: 1, 
        type: 'skill_gap', 
        text: "Add 'React Native' to your skills", 
        impact: "high",
        reasoning: "Mentioned in 85% of similar job postings" 
      },
      { 
        id: 2, 
        type: 'experience', 
        text: "Quantify your impact at TechCorp", 
        impact: "medium",
        reasoning: "Metrics improve ATS ranking by 40%" 
      },
      { 
        id: 3, 
        type: 'formatting', 
        text: "Use bullet points for achievements", 
        impact: "low",
        reasoning: "Improves readability for AI parsers" 
      }
    ],
    missingKeywords: ["Kubernetes", "CI/CD", "TypeScript"],
    matchDetails: {
      strongMatches: ["React", "Node.js", "5+ years experience"],
      partialMatches: ["Leadership", "Agile"],
      missing: ["GraphQL", "AWS Lambda"]
    }
  };
};

export const generateAnswer = async (question, userProfile) => {
  await delay(2000);
  
  const answers = {
    "Why do you want this job?": "I am excited about this role because it combines my expertise in ${userProfile.skills?.[0] || 'software development'} with my passion for ${userProfile.field || 'innovation'}. During my time at ${userProfile.experience?.[0]?.company || 'my previous company'}, I developed skills that directly align with your requirements...",
    "Tell me about yourself": "I am a ${userProfile.experience?.[0]?.title || 'software engineer'} with ${userProfile.experience?.length > 0 ? 'extensive' : 'growing'} experience in ${userProfile.field || 'technology'}..."
  };

  const text = answers[question] || `Based on my experience in ${userProfile.field || 'this field'} and my skills in ${userProfile.skills?.join(', ') || 'relevant technologies'}, I believe I am well-suited for this position...`;

  return {
    text,
    confidence: 0.89,
    sources: [
      `Your experience at ${userProfile.experience?.[0]?.company || 'TechCorp'}`,
      `Project: ${userProfile.projects?.[0]?.name || 'E-commerce Platform'}`
    ],
    wordCount: text.split(' ').length
  };
};

export const submitFeedback = async (contentId, type, comment = "") => {
  await delay(500);
  console.log(`Feedback received: ${type} for ${contentId}`, comment);
  return { success: true, id: contentId, type };
};

export const saveUserProfile = async (profileData) => {
  await delay(1000);
  localStorage.setItem('userProfile', JSON.stringify(profileData));
  return { success: true, profile: profileData };
};

export const getUserProfile = () => {
  const stored = localStorage.getItem('userProfile');
  return stored ? JSON.parse(stored) : null;
};

// Add to existing api.js file

export const detectFormFields = async (url) => {
  await delay(1500);
  
  // Simulate detected form fields from a job application page
  return {
    pageTitle: "Software Engineer Application - TechCorp",
    fields: [
      { id: "fullName", label: "Full Name", type: "text", required: true, value: "" },
      { id: "email", label: "Email Address", type: "email", required: true, value: "" },
      { id: "phone", label: "Phone Number", type: "tel", required: true, value: "" },
      { id: "linkedin", label: "LinkedIn URL", type: "url", required: false, value: "" },
      { id: "portfolio", label: "Portfolio/Website", type: "url", required: false, value: "" },
      { id: "experience", label: "Years of Experience", type: "select", required: true, value: "", options: ["0-1", "1-3", "3-5", "5-8", "8+"] },
      { id: "currentCompany", label: "Current Employer", type: "text", required: false, value: "" },
      { id: "skills", label: "Key Skills", type: "textarea", required: true, value: "" },
      { id: "salary", label: "Expected Salary", type: "text", required: false, value: "" },
      { id: "startDate", label: "Available Start Date", type: "date", required: true, value: "" },
      { id: "referral", label: "How did you hear about us?", type: "select", required: false, value: "", options: ["LinkedIn", "Indeed", "Referral", "Company Website", "Other"] }
    ]
  };
};

export const generateAutofillMappings = async (fields, userProfile) => {
  await delay(2000);
  
  if (!userProfile) {
    throw new Error("No profile found. Please complete your profile first.");
  }

  // AI logic to map profile data to form fields with confidence scores
  const mappings = fields.map(field => {
    let mappedValue = "";
    let confidence = 0;
    let source = "";
    
    switch(field.id) {
      case "fullName":
        mappedValue = userProfile.personal?.name || "";
        confidence = mappedValue ? 0.98 : 0;
        source = "Profile: Personal Info";
        break;
      case "email":
        mappedValue = userProfile.personal?.email || "";
        confidence = mappedValue ? 0.99 : 0;
        source = "Profile: Personal Info";
        break;
      case "phone":
        mappedValue = userProfile.personal?.phone || "";
        confidence = mappedValue ? 0.95 : 0;
        source = "Profile: Personal Info";
        break;
      case "linkedin":
        mappedValue = userProfile.personal?.linkedin || `linkedin.com/in/${userProfile.personal?.name?.toLowerCase().replace(/\s/g, '-') || ''}`;
        confidence = userProfile.personal?.linkedin ? 0.95 : 0.6;
        source = userProfile.personal?.linkedin ? "Profile: Personal Info" : "AI Generated";
        break;
      case "currentCompany":
        mappedValue = userProfile.experience?.[0]?.company || "";
        confidence = mappedValue ? 0.92 : 0;
        source = "Profile: Latest Experience";
        break;
      case "experience":
        // Calculate from experience entries
        const years = userProfile.experience?.reduce((acc, exp) => {
          const match = exp.duration?.match(/(\d{4})/g);
          if (match && match.length === 2) {
            return acc + (parseInt(match[1]) - parseInt(match[0]));
          }
          return acc;
        }, 0) || 0;
        
        if (years === 0) mappedValue = "0-1";
        else if (years <= 3) mappedValue = "1-3";
        else if (years <= 5) mappedValue = "3-5";
        else if (years <= 8) mappedValue = "5-8";
        else mappedValue = "8+";
        
        confidence = years > 0 ? 0.85 : 0.4;
        source = years > 0 ? "Calculated from Profile" : "Estimated";
        break;
      case "skills":
        mappedValue = userProfile.skills?.join(", ") || "";
        confidence = mappedValue ? 0.90 : 0;
        source = "Profile: Skills Section";
        break;
      case "portfolio":
        mappedValue = userProfile.projects?.[0]?.url || userProfile.personal?.website || "";
        confidence = mappedValue ? 0.88 : 0;
        source = mappedValue ? "Profile: Projects" : "";
        break;
      default:
        confidence = 0;
    }
    
    return {
      ...field,
      mappedValue,
      confidence,
      source,
      aiFilled: confidence > 0.7
    };
  });
  
  return mappings;
};

export const submitAutofillFeedback = async (fieldId, useful) => {
  await delay(500);
  return { success: true, fieldId, useful };
};