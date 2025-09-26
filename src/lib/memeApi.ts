// Meme API service for Timeless
// This handles communication with the backend API for meme template matching

export interface MemeTemplate {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  popularity: number;
  tags: string[];
}

export interface MemeMatchResult {
  userPhoto: string;
  memeTemplate: MemeTemplate;
  caption: string;
  confidence: number;
  matchReason: string;
}

export interface UploadResponse {
  success: boolean;
  result?: MemeMatchResult;
  error?: string;
}

class MemeApiService {
  private baseUrl: string;

  constructor() {
    // In production, this would be your actual API endpoint
    // Use Vite env (import.meta.env) in the browser; fall back to localStorage override; default to local dev API
    const viteUrl = (import.meta as any).env?.VITE_API_URL as string | undefined;
    const storedUrl = typeof window !== 'undefined' ? window.localStorage.getItem('VITE_API_URL') || undefined : undefined;
    this.baseUrl = viteUrl || storedUrl || 'http://localhost:3001/api';
  }

  /**
   * Upload a photo and get meme template match
   */
  async uploadPhotoAndMatch(imageFile: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`${this.baseUrl}/upload-and-match`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        result: result
      };
    } catch (error) {
      console.error('Error uploading photo:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get all available meme templates
   */
  async getMemeTemplates(): Promise<MemeTemplate[]> {
    try {
      const response = await fetch(`${this.baseUrl}/templates`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const templates = await response.json();
      return templates;
    } catch (error) {
      console.error('Error fetching templates:', error);
      // Return mock data for demo purposes
      return this.getMockTemplates();
    }
  }

  /**
   * Get a specific meme template by ID
   */
  async getMemeTemplate(id: string): Promise<MemeTemplate | null> {
    try {
      const response = await fetch(`${this.baseUrl}/templates/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const template = await response.json();
      return template;
    } catch (error) {
      console.error('Error fetching template:', error);
      return null;
    }
  }

  /**
   * Search meme templates by query
   */
  async searchTemplates(query: string): Promise<MemeTemplate[]> {
    try {
      const response = await fetch(`${this.baseUrl}/templates/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const templates = await response.json();
      return templates;
    } catch (error) {
      console.error('Error searching templates:', error);
      return [];
    }
  }

  /**
   * Get trending meme templates
   */
  async getTrendingTemplates(): Promise<MemeTemplate[]> {
    try {
      const response = await fetch(`${this.baseUrl}/templates/trending`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const templates = await response.json();
      return templates;
    } catch (error) {
      console.error('Error fetching trending templates:', error);
      return this.getMockTemplates().slice(0, 6);
    }
  }

  /**
   * Mock data for demo purposes
   */
  private getMockTemplates(): MemeTemplate[] {
    return [
      {
        id: '1',
        name: 'Distracted Boyfriend',
        imageUrl: 'https://i.imgflip.com/1bij.jpg',
        category: 'Relationship',
        popularity: 95,
        tags: ['relationship', 'cheating', 'distraction', 'boyfriend']
      },
      {
        id: '2',
        name: 'Drake Pointing',
        imageUrl: 'https://i.imgflip.com/30b1.jpg',
        category: 'Reaction',
        popularity: 90,
        tags: ['drake', 'pointing', 'approval', 'reaction']
      },
      {
        id: '3',
        name: 'Woman Yelling at Cat',
        imageUrl: 'https://i.imgflip.com/345v97.jpg',
        category: 'Argument',
        popularity: 88,
        tags: ['woman', 'cat', 'yelling', 'argument', 'confused']
      },
      {
        id: '4',
        name: 'This is Fine',
        imageUrl: 'https://i.imgflip.com/26am.jpg',
        category: 'Situational',
        popularity: 85,
        tags: ['fire', 'dog', 'fine', 'situational', 'acceptance']
      },
      {
        id: '5',
        name: 'Two Buttons',
        imageUrl: 'https://i.imgflip.com/1g8my.jpg',
        category: 'Decision',
        popularity: 82,
        tags: ['buttons', 'decision', 'choice', 'dilemma']
      },
      {
        id: '6',
        name: 'Expanding Brain',
        imageUrl: 'https://i.imgflip.com/1jwhww.jpg',
        category: 'Intelligence',
        popularity: 80,
        tags: ['brain', 'intelligence', 'evolution', 'progression']
      },
      {
        id: '7',
        name: 'Change My Mind',
        imageUrl: 'https://i.imgflip.com/24y43o.jpg',
        category: 'Debate',
        popularity: 78,
        tags: ['debate', 'opinion', 'change', 'mind']
      },
      {
        id: '8',
        name: 'Woman Cat',
        imageUrl: 'https://i.imgflip.com/2/1bij.jpg',
        category: 'Reaction',
        popularity: 75,
        tags: ['woman', 'cat', 'reaction', 'surprised']
      }
    ];
  }

  /**
   * Mock meme matching for demo purposes
   */
  async mockMemeMatch(imageFile: File): Promise<MemeMatchResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const templates = this.getMockTemplates();
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    const captions = [
      `This pic is giving *${randomTemplate.name}* energy 👀`,
      `Your vibe matches *${randomTemplate.name}* perfectly 🔥`,
      `This is pure *${randomTemplate.name}* material ✨`,
      `You're serving *${randomTemplate.name}* realness 💅`,
      `This photo screams *${randomTemplate.name}* energy 🚀`
    ];

    return {
      userPhoto: URL.createObjectURL(imageFile),
      memeTemplate: randomTemplate,
      caption: captions[Math.floor(Math.random() * captions.length)],
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
      matchReason: `Your photo matches the ${randomTemplate.category.toLowerCase()} category with ${randomTemplate.name} vibes`
    };
  }
}

// Export singleton instance
export const memeApiService = new MemeApiService();
export default memeApiService;
