import { EmbeddedContent, generateEmbedding } from './embeddings';

export interface SearchResult {
  content: string;
  metadata: Record<string, any>;
  score: number;
  type: string;
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

/**
 * In-memory vector store for portfolio content
 */
export class PortfolioVectorStore {
  private embeddings: EmbeddedContent[] = [];
  private isInitialized = false;

  /**
   * Initialize the vector store with embeddings
   */
  async initialize(embeddings?: EmbeddedContent[]): Promise<void> {
    if (this.isInitialized && !embeddings) {
      return;
    }

    try {
      if (embeddings) {
        this.embeddings = embeddings;
      } else {
        // Load from cache or generate new embeddings
        const cachedEmbeddings = await this.loadCachedEmbeddings();
        if (cachedEmbeddings && cachedEmbeddings.length > 0) {
          this.embeddings = cachedEmbeddings;
        } else {
          const { generatePortfolioEmbeddings } = await import('./embeddings');
          this.embeddings = await generatePortfolioEmbeddings();
          await this.saveCachedEmbeddings(this.embeddings);
        }
      }

      this.isInitialized = true;
      console.log(`Vector store initialized with ${this.embeddings.length} embeddings`);
    } catch (error) {
      console.error('Error initializing vector store:', error);
      throw new Error('Failed to initialize vector store');
    }
  }

  /**
   * Search for similar content
   */
  async search(query: string, topK: number = 5, minScore: number = 0.7): Promise<SearchResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Generate embedding for the query
      const queryEmbedding = await generateEmbedding(query);

      // Calculate similarities
      const similarities = this.embeddings.map(item => ({
        ...item,
        score: cosineSimilarity(queryEmbedding, item.embedding),
      }));

      // Filter by minimum score and sort by similarity
      const results = similarities
        .filter(item => item.score >= minScore)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map(item => ({
          content: item.content,
          metadata: item.metadata,
          score: item.score,
          type: item.type,
        }));

      return results;
    } catch (error) {
      console.error('Error searching vector store:', error);
      return [];
    }
  }

  /**
   * Get embeddings by type
   */
  getEmbeddingsByType(type: string): EmbeddedContent[] {
    return this.embeddings.filter(item => item.type === type);
  }

  /**
   * Get all embeddings
   */
  getAllEmbeddings(): EmbeddedContent[] {
    return this.embeddings;
  }

  /**
   * Add new embedding to the store
   */
  async addEmbedding(content: EmbeddedContent): Promise<void> {
    this.embeddings.push(content);
    await this.saveCachedEmbeddings(this.embeddings);
  }

  /**
   * Load cached embeddings from localStorage (client-side) or file system (server-side)
   */
  private async loadCachedEmbeddings(): Promise<EmbeddedContent[] | null> {
    try {
      // In a real application, you might want to cache embeddings in a database
      // For now, we'll generate them fresh each time
      return null;
    } catch (error) {
      console.error('Error loading cached embeddings:', error);
      return null;
    }
  }

  /**
   * Save embeddings to cache
   */
  private async saveCachedEmbeddings(embeddings: EmbeddedContent[]): Promise<void> {
    try {
      // In a real application, you might want to save embeddings to a database
      // For now, we'll skip caching
      console.log('Embeddings generated (caching skipped for demo)');
    } catch (error) {
      console.error('Error saving cached embeddings:', error);
    }
  }

  /**
   * Clear the vector store
   */
  clear(): void {
    this.embeddings = [];
    this.isInitialized = false;
  }
}

// Singleton instance
let vectorStoreInstance: PortfolioVectorStore | null = null;

/**
 * Get the singleton vector store instance
 */
export function getVectorStore(): PortfolioVectorStore {
  if (!vectorStoreInstance) {
    vectorStoreInstance = new PortfolioVectorStore();
  }
  return vectorStoreInstance;
}