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
      // Normalize fields if backend returns { id, name, url }
      const mapped: MemeTemplate[] = (templates as any[]).map((t) => ({
        id: String((t as any).id),
        name: String((t as any).name),
        imageUrl: String((t as any).imageUrl || (t as any).url),
        category: String((t as any).category || 'General'),
        popularity: Number((t as any).popularity || Math.floor(Math.random() * 15) + 85),
        tags: Array.isArray((t as any).tags) ? (t as any).tags : String((t as any).name).toLowerCase().split(/\s+/).slice(0,4),
      }));
      // Remove duplicates by id
      const unique = Array.from(new Map(mapped.map(m => [m.id, m])).values());
      return unique;
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
    // Mapped subset of provided dataset
    const provided = [
      { id:'181913649', name:'Drake Hotline Bling', url:'https://i.imgflip.com/30b1gx.jpg' },
      { id:'87743020', name:'Two Buttons', url:'https://i.imgflip.com/1g8my4.jpg' },
      { id:'112126428', name:'Distracted Boyfriend', url:'https://i.imgflip.com/1ur9b0.jpg' },
      { id:'252600902', name:'Always Has Been', url:'https://i.imgflip.com/46e43q.png' },
      { id:'188390779', name:'Woman Yelling At Cat', url:'https://i.imgflip.com/345v97.jpg' },
      { id:'93895088', name:'Expanding Brain', url:'https://i.imgflip.com/1jwhww.jpg' },
      { id:'61544', name:'Success Kid', url:'https://i.imgflip.com/1bhk.jpg' },
      { id:'61579', name:'One Does Not Simply', url:'https://i.imgflip.com/1bij.jpg' },
      { id:'129242436', name:'Change My Mind', url:'https://i.imgflip.com/24y43o.jpg' },
      { id:'4087833', name:'Waiting Skeleton', url:'https://i.imgflip.com/2fm6x.jpg' },
    ];
    return provided.map((m, idx) => ({
      id: m.id,
      name: m.name,
      imageUrl: m.url,
      category: ['Reaction','Decision','Relationship','Space','Argument'][idx % 5],
      popularity: 80 + ((10 - idx) % 10),
      tags: m.name.toLowerCase().split(/\s+/).slice(0,4)
    }));
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
