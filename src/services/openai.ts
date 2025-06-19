import { OpenAI } from 'openai';

// Check if OpenAI API key is available
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const isApiKeyValid = apiKey && apiKey !== 'your_openai_api_key_here' && apiKey.length > 10;

// Initialize OpenAI client only if API key is valid
let openai: OpenAI | null = null;
if (isApiKeyValid) {
  openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
  });
}

export interface InterviewContext {
  jobTitle: string;
  company: string;
  jobDescription: string;
  cvContent: string;
  interviewerType: 'friendly' | 'professional' | 'expert';
  userName: string;
  language: string;
}

export interface InterviewQuestion {
  question: string;
  context: string;
  expectedTopics: string[];
}

export class InterviewAI {
  private context: InterviewContext;
  private conversationHistory: Array<{ role: 'system' | 'user' | 'assistant', content: string }> = [];

  constructor(context: InterviewContext) {
    this.context = context;
    this.initializeSystemPrompt();
  }

  private initializeSystemPrompt() {
    const systemPrompt = this.generateSystemPrompt();
    this.conversationHistory.push({
      role: 'system',
      content: systemPrompt
    });
  }

  private generateSystemPrompt(): string {
    const { jobTitle, company, jobDescription, cvContent, interviewerType, userName, language } = this.context;

    const interviewerPersonalities = {
      friendly: {
        tone: "warm, encouraging, and supportive",
        style: "conversational and relaxed",
        approach: "focus on making the candidate comfortable while still being thorough"
      },
      professional: {
        tone: "professional, structured, and balanced",
        style: "formal but approachable",
        approach: "follow standard interview protocols with clear expectations"
      },
      expert: {
        tone: "challenging, detailed, and technical",
        style: "direct and probing",
        approach: "dive deep into technical competencies and industry knowledge"
      }
    };

    const personality = interviewerPersonalities[interviewerType];

    // Language-specific instructions
    const languageInstructions = this.getLanguageInstructions(language);

    return `You are an AI interviewer conducting a ${interviewerType} interview for the position of ${jobTitle} at ${company}.

INTERVIEWER PERSONALITY:
- Tone: ${personality.tone}
- Style: ${personality.style}
- Approach: ${personality.approach}

CANDIDATE INFORMATION:
- Name: ${userName}
- Position: ${jobTitle}
- Company: ${company}

JOB REQUIREMENTS:
${jobDescription}

CANDIDATE'S CV/RESUME:
${cvContent}

LANGUAGE & CULTURAL REQUIREMENTS:
${languageInstructions}

INTERVIEW GUIDELINES:
1. Always address the candidate as ${userName}
2. Ask questions relevant to the job requirements and their experience
3. Tailor questions based on their CV content
4. Maintain the ${interviewerType} interviewer personality throughout
5. Provide follow-up questions based on their responses
6. Keep responses conversational and natural for voice interaction
7. Respond EXCLUSIVELY in ${language} language
8. Keep responses concise but engaging (2-3 sentences max for voice)
9. Show genuine interest in their answers
10. Ask behavioral, technical, and situational questions appropriate to the role
11. Use culturally appropriate greetings and expressions
12. Adapt interview style to cultural norms of the language

CONVERSATION FLOW:
- Start with a warm greeting and introduction
- Ask about their background and interest in the role
- Dive into experience-based questions
- Ask situational/behavioral questions
- Conclude with their questions for you

CRITICAL: All responses must be in ${language}. Never switch languages or provide translations.

Remember: This is a voice conversation, so keep responses natural and conversational.`;
  }

  private getLanguageInstructions(language: string): string {
    const langCode = language.split('-')[0];
    
    const instructions = {
      'ar': `
- Respond in Modern Standard Arabic (فصحى)
- Use formal address (أنت/حضرتك) appropriate for professional settings
- Include Islamic greetings when culturally appropriate
- Be respectful of cultural values and work-life balance concepts
- Use professional Arabic terminology for business concepts`,
      
      'es': `
- Respond in professional Spanish
- Use formal address (usted) for professional respect
- Include appropriate Spanish business terminology
- Be warm but maintain professional boundaries
- Consider Latin American or Spanish cultural context as appropriate`,
      
      'fr': `
- Respond in professional French
- Use formal address (vous) throughout the interview
- Include appropriate French business terminology
- Maintain French professional etiquette and formality
- Be polite and structured in questioning approach`,
      
      'de': `
- Respond in professional German
- Use formal address (Sie) throughout
- Include appropriate German business terminology
- Maintain German professional directness and efficiency
- Be thorough and systematic in questioning`,
      
      'zh': `
- Respond in Simplified Chinese
- Use appropriate formal Chinese business language
- Include respectful forms of address (您)
- Consider Chinese professional culture and hierarchy
- Be respectful and thorough in approach`,
      
      'ja': `
- Respond in polite Japanese (敬語)
- Use appropriate keigo (honorific language) throughout
- Include proper Japanese business etiquette
- Be respectful of Japanese professional culture
- Use formal interview structure expected in Japan`,
      
      'id': `
- Respond in professional Bahasa Indonesia
- Use formal and respectful language (Anda/Bapak/Ibu)
- Include appropriate Indonesian business terminology
- Be warm but maintain professional respect
- Consider Indonesian cultural values of harmony and respect`,
      
      'my': `
- Respond in formal Myanmar language
- Use respectful forms of address appropriate for professional settings
- Include appropriate Myanmar business terminology
- Be respectful of Myanmar cultural values
- Maintain formal but warm professional tone`,
      
      'tl': `
- Respond in professional Filipino/Tagalog
- Use respectful forms of address (kayo/po)
- Include appropriate Filipino business terminology
- Be warm and respectful of Filipino cultural values
- Maintain professional but friendly tone`,
      
      'sw': `
- Respond in professional Kiswahili
- Use respectful forms of address
- Include appropriate Swahili business terminology
- Be respectful of East African cultural values
- Maintain warm but professional tone`,
      
      'hi': `
- Respond in professional Hindi
- Use respectful forms of address (आप)
- Include appropriate Hindi business terminology
- Be respectful of Indian cultural values and hierarchy
- Maintain formal but warm professional tone`,
      
      'pt': `
- Respond in professional Portuguese
- Use formal address (você/senhor/senhora)
- Include appropriate Portuguese business terminology
- Be warm but maintain professional boundaries
- Consider Brazilian or Portuguese cultural context`,
      
      'it': `
- Respond in professional Italian
- Use formal address (Lei) throughout
- Include appropriate Italian business terminology
- Maintain Italian professional warmth and engagement
- Be expressive but professional`,
      
      'ru': `
- Respond in professional Russian
- Use formal address (Вы) throughout
- Include appropriate Russian business terminology
- Maintain Russian professional directness
- Be thorough and systematic`,
      
      'ko': `
- Respond in professional Korean
- Use appropriate honorific language (존댓말)
- Include proper Korean business etiquette
- Be respectful of Korean professional hierarchy
- Use formal interview structure expected in Korea`
    };

    return instructions[langCode as keyof typeof instructions] || `
- Respond in professional ${language}
- Use formal and respectful language appropriate for business settings
- Include appropriate business terminology in the target language
- Be culturally sensitive and professional
- Maintain formal but warm professional tone`;
  }

  async generateResponse(userInput: string): Promise<string> {
    // Check if OpenAI is available
    if (!openai || !isApiKeyValid) {
      console.warn('OpenAI API not available - using fallback responses');
      return this.getFallbackResponse(userInput);
    }

    try {
      // Add user input to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: userInput
      });

      // Generate AI response using GPT-4
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: this.conversationHistory,
        max_tokens: 150,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const response = completion.choices[0]?.message?.content || 
        this.getFallbackResponse(userInput);

      // Add AI response to conversation history
      this.conversationHistory.push({
        role: 'assistant',
        content: response
      });

      // Keep conversation history manageable (last 20 messages)
      if (this.conversationHistory.length > 21) { // 1 system + 20 conversation
        this.conversationHistory = [
          this.conversationHistory[0], // Keep system prompt
          ...this.conversationHistory.slice(-20)
        ];
      }

      return response;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return this.getFallbackResponse(userInput);
    }
  }

  private getFallbackResponse(userInput: string): string {
    const { userName, jobTitle, company, interviewerType, language } = this.context;
    
    // Generate contextual fallback responses based on input keywords and language
    const input = userInput.toLowerCase();
    const langCode = language.split('-')[0];
    
    // Language-specific responses
    const responses = this.getLanguageSpecificResponses(langCode, userName, jobTitle, company, input);
    
    // Select appropriate response based on input content
    if (input.includes('experience') || input.includes('work') || input.includes('job') || 
        input.includes('خبرة') || input.includes('عمل') || input.includes('وظيفة') ||
        input.includes('experiencia') || input.includes('trabajo') ||
        input.includes('expérience') || input.includes('travail') ||
        input.includes('erfahrung') || input.includes('arbeit')) {
      return responses.experience[Math.floor(Math.random() * responses.experience.length)];
    }
    
    if (input.includes('challenge') || input.includes('difficult') || input.includes('problem') ||
        input.includes('تحدي') || input.includes('صعب') || input.includes('مشكلة') ||
        input.includes('desafío') || input.includes('difícil') || input.includes('problema') ||
        input.includes('défi') || input.includes('difficile') || input.includes('problème') ||
        input.includes('herausforderung') || input.includes('schwierig')) {
      return responses.challenge[Math.floor(Math.random() * responses.challenge.length)];
    }
    
    if (input.includes('team') || input.includes('collaborate') || input.includes('group') ||
        input.includes('فريق') || input.includes('تعاون') || input.includes('مجموعة') ||
        input.includes('equipo') || input.includes('colaborar') || input.includes('grupo') ||
        input.includes('équipe') || input.includes('collaborer') || input.includes('groupe') ||
        input.includes('team') || input.includes('zusammenarbeit')) {
      return responses.team[Math.floor(Math.random() * responses.team.length)];
    }
    
    if (input.includes('goal') || input.includes('achievement') || input.includes('success') ||
        input.includes('هدف') || input.includes('إنجاز') || input.includes('نجاح') ||
        input.includes('objetivo') || input.includes('logro') || input.includes('éxito') ||
        input.includes('objectif') || input.includes('réalisation') || input.includes('succès') ||
        input.includes('ziel') || input.includes('erfolg')) {
      return responses.achievement[Math.floor(Math.random() * responses.achievement.length)];
    }
    
    // Default fallback responses based on interviewer type
    const defaultResponses = responses[interviewerType] || responses.professional;
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  private getLanguageSpecificResponses(langCode: string, userName: string, jobTitle: string, company: string, input: string) {
    const responseTemplates = {
      'ar': {
        experience: [
          `هذا رائع ${userName}. هل يمكنك أن تخبرني المزيد عن كيفية تطبيق هذه المهارات في منصب ${jobTitle} هنا في ${company}؟`,
          `خبرة قيمة ${userName}. كيف تعتقد أن هذه التجربة ستساعدك في هذا الدور؟`,
          `ممتاز ${userName}. ما هي أهم الدروس التي تعلمتها من هذه التجربة؟`
        ],
        challenge: [
          `تحدٍ مثير للاهتمام ${userName}. ماذا تعلمت من هذه التجربة، وكيف ستتعامل مع مواقف مماثلة في هذا الدور؟`,
          `أقدر صراحتك ${userName}. كيف طورت هذه التجربة مهاراتك في حل المشكلات؟`,
          `هذا يظهر مرونة حقيقية ${userName}. ما هي استراتيجيتك للتعامل مع التحديات؟`
        ],
        team: [
          `العمل الجماعي مهم لهذا المنصب ${userName}. هل يمكنك إعطائي مثالاً آخر عن كيفية عملك بفعالية مع الآخرين؟`,
          `ممتاز ${userName}. كيف تتعامل مع الصراعات في الفريق؟`,
          `هذا يظهر مهارات قيادية جيدة ${userName}. كيف تحفز أعضاء الفريق؟`
        ],
        achievement: [
          `إنجاز رائع ${userName}. ما الذي يحفزك لتحقيق مثل هذه الأهداف؟`,
          `هذا مثير للإعجاب ${userName}. كيف تقيس النجاح في عملك؟`,
          `ممتاز ${userName}. كيف تخطط لتحقيق أهداف مماثلة في ${company}؟`
        ],
        friendly: [
          `هذا رائع حقاً ${userName}. أحب أن أسمع المزيد عن هذه التجربة.`,
          `شكراً لمشاركة ذلك ${userName}. ما الذي استمتعت به أكثر في هذا الموقف؟`,
          `رؤية رائعة ${userName}. كيف تعتقد أن هذا يرتبط بما نقوم به هنا في ${company}؟`
        ],
        professional: [
          `شكراً لهذا الرد ${userName}. هل يمكنك التوسع في النتائج المحددة؟`,
          `أقدر وجهة نظرك ${userName}. ما هي المقاييس التي استخدمتها لقياس النجاح؟`,
          `هذه معلومات قيمة ${userName}. كيف ستطبق هذه التجربة على هذا الدور؟`
        ],
        expert: [
          `نهج مثير للاهتمام ${userName}. ما هي الاستراتيجيات البديلة التي فكرت فيها؟`,
          `أرى ${userName}. ما هي التحديات التقنية التي واجهتها في هذا الموقف؟`,
          `نقطة جيدة ${userName}. كيف ستحسن هذه العملية للحصول على نتائج أفضل؟`
        ]
      },
      'es': {
        experience: [
          `Eso es valioso ${userName}. ¿Cómo crees que esas habilidades se aplicarían al rol de ${jobTitle} aquí en ${company}?`,
          `Experiencia valiosa ${userName}. ¿Cómo piensas que esta experiencia te ayudará en este rol?`,
          `Excelente ${userName}. ¿Cuáles fueron las lecciones más importantes que aprendiste de esa experiencia?`
        ],
        challenge: [
          `Desafío interesante ${userName}. ¿Qué aprendiste de esa experiencia y cómo manejarías situaciones similares en este rol?`,
          `Aprecio tu honestidad ${userName}. ¿Cómo desarrolló esta experiencia tus habilidades de resolución de problemas?`,
          `Eso muestra verdadera resistencia ${userName}. ¿Cuál es tu estrategia para manejar desafíos?`
        ],
        team: [
          `El trabajo en equipo es importante para este puesto ${userName}. ¿Puedes darme otro ejemplo de cómo has trabajado efectivamente con otros?`,
          `Excelente ${userName}. ¿Cómo manejas los conflictos en el equipo?`,
          `Eso muestra buenas habilidades de liderazgo ${userName}. ¿Cómo motivas a los miembros del equipo?`
        ],
        achievement: [
          `Gran logro ${userName}. ¿Qué te motiva a alcanzar tales objetivos?`,
          `Eso es impresionante ${userName}. ¿Cómo mides el éxito en tu trabajo?`,
          `Excelente ${userName}. ¿Cómo planeas lograr objetivos similares en ${company}?`
        ],
        friendly: [
          `Eso es realmente interesante ${userName}. Me encantaría escuchar más sobre esa experiencia.`,
          `Gracias por compartir eso ${userName}. ¿Qué fue lo que más disfrutaste de esa situación?`,
          `Gran perspectiva ${userName}. ¿Cómo crees que eso se relaciona con lo que hacemos aquí en ${company}?`
        ],
        professional: [
          `Gracias por esa respuesta ${userName}. ¿Podrías elaborar sobre los resultados específicos?`,
          `Aprecio tu perspectiva ${userName}. ¿Qué métricas usaste para medir el éxito?`,
          `Esa es información valiosa ${userName}. ¿Cómo aplicarías esa experiencia a este rol?`
        ],
        expert: [
          `Enfoque interesante ${userName}. ¿Qué estrategias alternativas consideraste?`,
          `Ya veo ${userName}. ¿Cuáles fueron los desafíos técnicos que enfrentaste en esa situación?`,
          `Buen punto ${userName}. ¿Cómo optimizarías ese proceso para mejores resultados?`
        ]
      },
      'fr': {
        experience: [
          `C'est précieux ${userName}. Comment pensez-vous que ces compétences s'appliqueraient au rôle de ${jobTitle} ici chez ${company}?`,
          `Expérience précieuse ${userName}. Comment pensez-vous que cette expérience vous aidera dans ce rôle?`,
          `Excellent ${userName}. Quelles ont été les leçons les plus importantes que vous avez apprises de cette expérience?`
        ],
        challenge: [
          `Défi intéressant ${userName}. Qu'avez-vous appris de cette expérience et comment géreriez-vous des situations similaires dans ce rôle?`,
          `J'apprécie votre honnêteté ${userName}. Comment cette expérience a-t-elle développé vos compétences en résolution de problèmes?`,
          `Cela montre une vraie résilience ${userName}. Quelle est votre stratégie pour gérer les défis?`
        ],
        team: [
          `Le travail d'équipe est important pour ce poste ${userName}. Pouvez-vous me donner un autre exemple de comment vous avez travaillé efficacement avec d'autres?`,
          `Excellent ${userName}. Comment gérez-vous les conflits dans l'équipe?`,
          `Cela montre de bonnes compétences de leadership ${userName}. Comment motivez-vous les membres de l'équipe?`
        ],
        achievement: [
          `Grande réalisation ${userName}. Qu'est-ce qui vous motive à atteindre de tels objectifs?`,
          `C'est impressionnant ${userName}. Comment mesurez-vous le succès dans votre travail?`,
          `Excellent ${userName}. Comment prévoyez-vous d'atteindre des objectifs similaires chez ${company}?`
        ],
        friendly: [
          `C'est vraiment intéressant ${userName}. J'aimerais en entendre plus sur cette expérience.`,
          `Merci de partager cela ${userName}. Qu'est-ce que vous avez le plus apprécié dans cette situation?`,
          `Belle perspective ${userName}. Comment pensez-vous que cela se rapporte à ce que nous faisons ici chez ${company}?`
        ],
        professional: [
          `Merci pour cette réponse ${userName}. Pourriez-vous élaborer sur les résultats spécifiques?`,
          `J'apprécie votre perspective ${userName}. Quelles métriques avez-vous utilisées pour mesurer le succès?`,
          `C'est une information précieuse ${userName}. Comment appliqueriez-vous cette expérience à ce rôle?`
        ],
        expert: [
          `Approche intéressante ${userName}. Quelles stratégies alternatives avez-vous considérées?`,
          `Je vois ${userName}. Quels ont été les défis techniques que vous avez rencontrés dans cette situation?`,
          `Bon point ${userName}. Comment optimiseriez-vous ce processus pour de meilleurs résultats?`
        ]
      },
      'de': {
        experience: [
          `Das ist wertvoll ${userName}. Wie denken Sie, würden sich diese Fähigkeiten auf die ${jobTitle} Rolle hier bei ${company} anwenden lassen?`,
          `Wertvolle Erfahrung ${userName}. Wie denken Sie, wird Ihnen diese Erfahrung in dieser Rolle helfen?`,
          `Ausgezeichnet ${userName}. Was waren die wichtigsten Lektionen, die Sie aus dieser Erfahrung gelernt haben?`
        ],
        challenge: [
          `Interessante Herausforderung ${userName}. Was haben Sie aus dieser Erfahrung gelernt und wie würden Sie ähnliche Situationen in dieser Rolle handhaben?`,
          `Ich schätze Ihre Ehrlichkeit ${userName}. Wie hat diese Erfahrung Ihre Problemlösungsfähigkeiten entwickelt?`,
          `Das zeigt echte Widerstandsfähigkeit ${userName}. Was ist Ihre Strategie für den Umgang mit Herausforderungen?`
        ],
        team: [
          `Teamarbeit ist wichtig für diese Position ${userName}. Können Sie mir ein weiteres Beispiel dafür geben, wie Sie effektiv mit anderen gearbeitet haben?`,
          `Ausgezeichnet ${userName}. Wie gehen Sie mit Konflikten im Team um?`,
          `Das zeigt gute Führungsqualitäten ${userName}. Wie motivieren Sie Teammitglieder?`
        ],
        achievement: [
          `Große Leistung ${userName}. Was motiviert Sie, solche Ziele zu erreichen?`,
          `Das ist beeindruckend ${userName}. Wie messen Sie Erfolg in Ihrer Arbeit?`,
          `Ausgezeichnet ${userName}. Wie planen Sie, ähnliche Ziele bei ${company} zu erreichen?`
        ],
        friendly: [
          `Das ist wirklich interessant ${userName}. Ich würde gerne mehr über diese Erfahrung hören.`,
          `Danke, dass Sie das geteilt haben ${userName}. Was haben Sie an dieser Situation am meisten genossen?`,
          `Tolle Perspektive ${userName}. Wie denken Sie, bezieht sich das auf das, was wir hier bei ${company} tun?`
        ],
        professional: [
          `Danke für diese Antwort ${userName}. Könnten Sie die spezifischen Ergebnisse näher erläutern?`,
          `Ich schätze Ihre Perspektive ${userName}. Welche Metriken haben Sie verwendet, um den Erfolg zu messen?`,
          `Das sind wertvolle Informationen ${userName}. Wie würden Sie diese Erfahrung auf diese Rolle anwenden?`
        ],
        expert: [
          `Interessanter Ansatz ${userName}. Welche alternativen Strategien haben Sie in Betracht gezogen?`,
          `Ich verstehe ${userName}. Was waren die technischen Herausforderungen, denen Sie in dieser Situation begegnet sind?`,
          `Guter Punkt ${userName}. Wie würden Sie diesen Prozess für bessere Ergebnisse optimieren?`
        ]
      }
    };

    // Return English responses as fallback if language not found
    return responseTemplates[langCode as keyof typeof responseTemplates] || {
      experience: [
        `That's valuable experience, ${userName}. How do you think those skills would apply to the ${jobTitle} role here at ${company}?`,
        `Interesting background, ${userName}. How do you see that experience helping you in this role?`,
        `Great insight, ${userName}. What were the most important lessons you learned from that experience?`
      ],
      challenge: [
        `Interesting challenge, ${userName}. What did you learn from that experience, and how would you handle similar situations in this role?`,
        `I appreciate your honesty, ${userName}. How did that experience develop your problem-solving skills?`,
        `That shows real resilience, ${userName}. What's your strategy for handling challenges?`
      ],
      team: [
        `Teamwork is important for this position, ${userName}. Can you give me another example of how you've worked effectively with others?`,
        `Excellent, ${userName}. How do you handle conflicts within a team?`,
        `That shows good leadership skills, ${userName}. How do you motivate team members?`
      ],
      achievement: [
        `That's a great accomplishment, ${userName}. What motivates you to achieve such goals?`,
        `That's impressive, ${userName}. How do you measure success in your work?`,
        `Excellent, ${userName}. How do you plan to achieve similar goals at ${company}?`
      ],
      friendly: [
        `That's really interesting, ${userName}. I'd love to hear more about that experience.`,
        `Thanks for sharing that, ${userName}. What did you enjoy most about that situation?`,
        `Great insight, ${userName}. How do you think that relates to what we do here at ${company}?`
      ],
      professional: [
        `Thank you for that response, ${userName}. Could you elaborate on the specific outcomes?`,
        `I appreciate your perspective, ${userName}. What metrics did you use to measure success?`,
        `That's valuable information, ${userName}. How would you apply that experience to this role?`
      ],
      expert: [
        `Interesting approach, ${userName}. What alternative strategies did you consider?`,
        `I see, ${userName}. What were the technical challenges you faced in that situation?`,
        `Good point, ${userName}. How would you optimize that process for better results?`
      ]
    };
  }

  async analyzeInterview(): Promise<{
    overallScore: number;
    strengths: string[];
    improvements: string[];
    feedback: string;
  }> {
    // Check if OpenAI is available
    if (!openai || !isApiKeyValid) {
      console.warn('OpenAI API not available - using fallback analysis');
      return this.getFallbackAnalysis();
    }

    try {
      const analysisPrompt = `Based on this interview conversation, provide a comprehensive analysis in ${this.context.language}:

CONVERSATION HISTORY:
${this.conversationHistory.slice(1).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Please analyze the candidate's performance and provide:
1. Overall score (0-100)
2. Key strengths (3-4 points)
3. Areas for improvement (3-4 points)
4. Detailed feedback paragraph

IMPORTANT: Respond entirely in ${this.context.language}. Format as JSON:
{
  "overallScore": number,
  "strengths": ["strength1", "strength2", ...],
  "improvements": ["improvement1", "improvement2", ...],
  "feedback": "detailed feedback paragraph in ${this.context.language}"
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: analysisPrompt }],
        max_tokens: 500,
        temperature: 0.3
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        try {
          return JSON.parse(response);
        } catch (parseError) {
          console.error('Failed to parse analysis response:', parseError);
        }
      }
    } catch (error) {
      console.error('Analysis API Error:', error);
    }

    return this.getFallbackAnalysis();
  }

  private getFallbackAnalysis(): {
    overallScore: number;
    strengths: string[];
    improvements: string[];
    feedback: string;
  } {
    const { userName, jobTitle, company, language } = this.context;
    
    // Generate score based on conversation length and engagement
    const conversationLength = this.conversationHistory.length;
    const baseScore = Math.min(75 + (conversationLength * 2), 90);
    
    // Get language-specific feedback
    const langCode = language.split('-')[0];
    const feedback = this.getLanguageSpecificFeedback(langCode, userName, jobTitle, company, baseScore);
    
    return {
      overallScore: baseScore,
      ...feedback
    };
  }

  private getLanguageSpecificFeedback(langCode: string, userName: string, jobTitle: string, company: string, score: number) {
    const feedbackTemplates = {
      'ar': {
        strengths: [
          'أظهر مهارات تواصل جيدة',
          'أبدى حماساً للدور',
          'قدم أمثلة ذات صلة من الخبرة',
          'تفاعل بشكل جيد في المحادثة'
        ],
        improvements: [
          'يمكن تقديم أمثلة أكثر تحديداً مع نتائج قابلة للقياس',
          'فكر في طرح المزيد من الأسئلة حول ثقافة الشركة',
          'توسع أكثر في المهارات التقنية والكفاءات',
          'ناقش الأهداف المهنية طويلة المدى وكيفية توافقها مع الدور'
        ],
        feedback: `${userName} أظهر مهارات تواصل قوية واهتماماً حقيقياً بمنصب ${jobTitle} في ${company}. أظهرت المحادثة تفاعلاً جيداً ومشاركة خبرات ذات صلة. للتحسن أكثر، ركز على تقديم أمثلة أكثر تحديداً مع نتائج قابلة للقياس وطرح أسئلة مدروسة حول الدور والشركة. بشكل عام، كان هذا أداءً إيجابياً في المقابلة مع إمكانات واضحة للنجاح في الدور.`
      },
      'es': {
        strengths: [
          'Demostró buenas habilidades de comunicación',
          'Mostró entusiasmo por el rol',
          'Proporcionó ejemplos relevantes de la experiencia',
          'Se involucró bien en la conversación'
        ],
        improvements: [
          'Podría proporcionar ejemplos más específicos con resultados medibles',
          'Considerar hacer más preguntas sobre la cultura de la empresa',
          'Elaborar más sobre habilidades técnicas y competencias',
          'Discutir objetivos profesionales a largo plazo y cómo se alinean con el rol'
        ],
        feedback: `${userName} demostró fuertes habilidades de comunicación e interés genuino en el puesto de ${jobTitle} en ${company}. La conversación mostró buen compromiso y compartir experiencias relevantes. Para mejorar aún más, enfócate en proporcionar ejemplos más específicos con resultados cuantificables y hacer preguntas reflexivas sobre el rol y la empresa. En general, este fue un rendimiento positivo en la entrevista con claro potencial para el éxito en el rol.`
      },
      'fr': {
        strengths: [
          'A démontré de bonnes compétences en communication',
          'A montré de l\'enthousiasme pour le rôle',
          'A fourni des exemples pertinents de l\'expérience',
          'S\'est bien engagé dans la conversation'
        ],
        improvements: [
          'Pourrait fournir des exemples plus spécifiques avec des résultats mesurables',
          'Considérer poser plus de questions sur la culture d\'entreprise',
          'Élaborer davantage sur les compétences techniques',
          'Discuter des objectifs de carrière à long terme et comment ils s\'alignent avec le rôle'
        ],
        feedback: `${userName} a démontré de solides compétences en communication et un intérêt sincère pour le poste de ${jobTitle} chez ${company}. La conversation a montré un bon engagement et le partage d\'expériences pertinentes. Pour s\'améliorer davantage, concentrez-vous sur la fourniture d\'exemples plus spécifiques avec des résultats quantifiables et posez des questions réfléchies sur le rôle et l\'entreprise. Dans l\'ensemble, c\'était une performance positive d\'entretien avec un potentiel clair de succès dans le rôle.`
      },
      'de': {
        strengths: [
          'Zeigte gute Kommunikationsfähigkeiten',
          'Zeigte Begeisterung für die Rolle',
          'Lieferte relevante Beispiele aus der Erfahrung',
          'Engagierte sich gut im Gespräch'
        ],
        improvements: [
          'Könnte spezifischere Beispiele mit messbaren Ergebnissen liefern',
          'Erwägen Sie, mehr Fragen zur Unternehmenskultur zu stellen',
          'Mehr über technische Fähigkeiten und Kompetenzen ausführen',
          'Langfristige Karriereziele diskutieren und wie sie sich mit der Rolle ausrichten'
        ],
        feedback: `${userName} zeigte starke Kommunikationsfähigkeiten und echtes Interesse an der ${jobTitle} Position bei ${company}. Das Gespräch zeigte gutes Engagement und das Teilen relevanter Erfahrungen. Um sich weiter zu verbessern, konzentrieren Sie sich darauf, spezifischere Beispiele mit quantifizierbaren Ergebnissen zu liefern und durchdachte Fragen über die Rolle und das Unternehmen zu stellen. Insgesamt war dies eine positive Interview-Leistung mit klarem Potenzial für Erfolg in der Rolle.`
      }
    };

    return feedbackTemplates[langCode as keyof typeof feedbackTemplates] || {
      strengths: [
        'Demonstrated good communication skills',
        'Showed enthusiasm for the role',
        'Provided relevant examples from experience',
        'Engaged well in the conversation'
      ],
      improvements: [
        'Could provide more specific examples with measurable outcomes',
        'Consider asking more questions about the company culture',
        'Elaborate more on technical skills and competencies',
        'Discuss long-term career goals and how they align with the role'
      ],
      feedback: `${userName} demonstrated strong communication skills and genuine interest in the ${jobTitle} position at ${company}. The conversation showed good engagement and relevant experience sharing. To further improve, focus on providing more specific examples with quantifiable results and asking thoughtful questions about the role and company. Overall, this was a positive interview performance with clear potential for success in the role.`
    };
  }
}

// CV Analysis Service
export async function analyzeCVContent(cvText: string): Promise<{
  skills: string[];
  experience: string[];
  education: string[];
  summary: string;
}> {
  // Check if OpenAI is available
  if (!openai || !isApiKeyValid) {
    console.warn('OpenAI API not available - using fallback CV analysis');
    return getFallbackCVAnalysis(cvText);
  }

  try {
    const analysisPrompt = `Analyze this CV/Resume content and extract key information:

CV CONTENT:
${cvText}

Extract and format as JSON:
{
  "skills": ["skill1", "skill2", ...],
  "experience": ["experience1", "experience2", ...],
  "education": ["education1", "education2", ...],
  "summary": "brief professional summary"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: analysisPrompt }],
      max_tokens: 400,
      temperature: 0.3
    });

    const response = completion.choices[0]?.message?.content;
    if (response) {
      try {
        return JSON.parse(response);
      } catch (parseError) {
        console.error('Failed to parse CV analysis:', parseError);
      }
    }
  } catch (error) {
    console.error('CV Analysis Error:', error);
  }

  return getFallbackCVAnalysis(cvText);
}

function getFallbackCVAnalysis(cvText: string): {
  skills: string[];
  experience: string[];
  education: string[];
  summary: string;
} {
  // Simple keyword-based analysis as fallback
  const text = cvText.toLowerCase();
  
  const commonSkills = [
    'communication', 'leadership', 'problem solving', 'teamwork', 'project management',
    'javascript', 'python', 'react', 'node.js', 'sql', 'html', 'css', 'git',
    'microsoft office', 'excel', 'powerpoint', 'data analysis', 'marketing',
    'sales', 'customer service', 'time management', 'organization'
  ];
  
  const detectedSkills = commonSkills.filter(skill => 
    text.includes(skill.toLowerCase())
  ).slice(0, 8);
  
  return {
    skills: detectedSkills.length > 0 ? detectedSkills : ['Communication', 'Problem Solving', 'Teamwork'],
    experience: ['Professional experience in relevant field', 'Demonstrated track record of success'],
    education: ['Educational background', 'Relevant qualifications'],
    summary: 'Experienced professional with relevant skills and background for the position.'
  };
}