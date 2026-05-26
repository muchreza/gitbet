export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          github_id: string;
          username: string;
          name: string | null;
          avatar_url: string | null;
          email: string | null;
          balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          github_id: string;
          username: string;
          name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          balance?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          github_id?: string;
          username?: string;
          name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          balance?: number;
          updated_at?: string;
        };
      };
      markets: {
        Row: {
          id: string;
          repo: string;
          owner: string;
          question: string;
          description: string | null;
          category: "stars" | "forks" | "releases" | "trending";
          end_date: string;
          resolved: boolean;
          outcome: boolean | null;
          target_value: number | null;
          language: string | null;
          language_color: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          repo: string;
          owner: string;
          question: string;
          description?: string | null;
          category: "stars" | "forks" | "releases" | "trending";
          end_date: string;
          resolved?: boolean;
          outcome?: boolean | null;
          target_value?: number | null;
          language?: string | null;
          language_color?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          resolved?: boolean;
          outcome?: boolean | null;
        };
      };
      bets: {
        Row: {
          id: string;
          user_id: string;
          market_id: string;
          position: boolean;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          market_id: string;
          position: boolean;
          amount: number;
          created_at?: string;
        };
        Update: never;
      };
    };
  };
}
