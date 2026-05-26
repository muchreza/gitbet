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
          wallet_address: string | null;
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
          wallet_address?: string | null;
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
          wallet_address?: string | null;
          updated_at?: string;
        };
      };
      markets: {
        Row: {
          id: string;
          question: string;
          description: string | null;
          coin_id: string;
          coin_symbol: string;
          coin_name: string;
          coin_image: string | null;
          target_price: number;
          category: "price_above" | "price_below" | "price_change" | "general";
          end_date: string;
          resolved: boolean;
          outcome: boolean | null;
          chain_market_id: number | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          description?: string | null;
          coin_id: string;
          coin_symbol: string;
          coin_name: string;
          coin_image?: string | null;
          target_price: number;
          category: "price_above" | "price_below" | "price_change" | "general";
          end_date: string;
          resolved?: boolean;
          outcome?: boolean | null;
          chain_market_id?: number | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          resolved?: boolean;
          outcome?: boolean | null;
          chain_market_id?: number | null;
        };
      };
      bets: {
        Row: {
          id: string;
          user_id: string;
          market_id: string;
          position: boolean;
          amount: number;
          tx_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          market_id: string;
          position: boolean;
          amount: number;
          tx_hash?: string | null;
          created_at?: string;
        };
        Update: never;
      };
      daily_claims: {
        Row: {
          id: string;
          claim_date: string;
          claim_count: number;
        };
        Insert: {
          id?: string;
          claim_date: string;
          claim_count?: number;
        };
        Update: {
          claim_count?: number;
        };
      };
    };
  };
}
