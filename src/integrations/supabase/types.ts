export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agency_settings: {
        Row: {
          address: string
          email: string
          facebook: string | null
          id: number
          instagram: string | null
          linkedin: string | null
          name: string
          phone: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          address?: string
          email?: string
          facebook?: string | null
          id?: number
          instagram?: string | null
          linkedin?: string | null
          name?: string
          phone?: string
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          address?: string
          email?: string
          facebook?: string | null
          id?: number
          instagram?: string | null
          linkedin?: string | null
          name?: string
          phone?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          slug: string
          status: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          slug: string
          status?: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          slug?: string
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          business: string | null
          created_at: string
          email: string | null
          id: string
          join_date: string | null
          name: string
          phone: string | null
          services: string[] | null
          total_paid: number | null
          updated_at: string
        }
        Insert: {
          business?: string | null
          created_at?: string
          email?: string | null
          id?: string
          join_date?: string | null
          name: string
          phone?: string | null
          services?: string[] | null
          total_paid?: number | null
          updated_at?: string
        }
        Update: {
          business?: string | null
          created_at?: string
          email?: string | null
          id?: string
          join_date?: string | null
          name?: string
          phone?: string | null
          services?: string[] | null
          total_paid?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          business_type: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string
          service_interested: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          business_type?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone: string
          service_interested?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          business_type?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          service_interested?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: []
      }
      pricing_packages: {
        Row: {
          created_at: string
          cta_label: string | null
          enabled: boolean
          features: string[]
          id: string
          is_popular: boolean
          name: string
          price: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_label?: string | null
          enabled?: boolean
          features?: string[]
          id?: string
          is_popular?: boolean
          name: string
          price: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_label?: string | null
          enabled?: boolean
          features?: string[]
          id?: string
          is_popular?: boolean
          name?: string
          price?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget: number | null
          client_name: string
          created_at: string
          deadline: string | null
          id: string
          project_type: string
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          budget?: number | null
          client_name: string
          created_at?: string
          deadline?: string | null
          id?: string
          project_type: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          budget?: number | null
          client_name?: string
          created_at?: string
          deadline?: string | null
          id?: string
          project_type?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string
          enabled: boolean
          icon: string
          id: string
          name: string
          price: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          enabled?: boolean
          icon: string
          id?: string
          name: string
          price?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          enabled?: boolean
          icon?: string
          id?: string
          name?: string
          price?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          created_at: string
          id: string
          input_type: string
          key: string
          label: string | null
          section: string
          sort_order: number
          updated_at: string
          value_image_url: string | null
          value_json: Json | null
          value_text: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          input_type?: string
          key: string
          label?: string | null
          section: string
          sort_order?: number
          updated_at?: string
          value_image_url?: string | null
          value_json?: Json | null
          value_text?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          input_type?: string
          key?: string
          label?: string | null
          section?: string
          sort_order?: number
          updated_at?: string
          value_image_url?: string | null
          value_json?: Json | null
          value_text?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          email: string | null
          enabled: boolean
          facebook_url: string | null
          github_url: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          name: string
          phone: string | null
          photo_url: string | null
          role: string
          sort_order: number
          twitter_url: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email?: string | null
          enabled?: boolean
          facebook_url?: string | null
          github_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          name: string
          phone?: string | null
          photo_url?: string | null
          role: string
          sort_order?: number
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string | null
          enabled?: boolean
          facebook_url?: string | null
          github_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          role?: string
          sort_order?: number
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      tracking_settings: {
        Row: {
          clarity_id: string | null
          created_at: string
          custom_body_scripts: string | null
          custom_css: string | null
          custom_head_scripts: string | null
          custom_js: string | null
          enabled: boolean
          ga4_id: string | null
          google_ads_conversion_id: string | null
          google_ads_label: string | null
          google_search_console: string | null
          google_site_verification: string | null
          gtm_id: string | null
          hotjar_id: string | null
          id: number
          linkedin_partner_id: string | null
          meta_capi_token: string | null
          meta_domain_verification: string | null
          meta_pixel_id: string | null
          meta_test_event_code: string | null
          pinterest_tag_id: string | null
          robots_txt: string | null
          schema_markup: string | null
          sitemap_xml: string | null
          snapchat_pixel_id: string | null
          tiktok_pixel_id: string | null
          twitter_pixel_id: string | null
          updated_at: string
        }
        Insert: {
          clarity_id?: string | null
          created_at?: string
          custom_body_scripts?: string | null
          custom_css?: string | null
          custom_head_scripts?: string | null
          custom_js?: string | null
          enabled?: boolean
          ga4_id?: string | null
          google_ads_conversion_id?: string | null
          google_ads_label?: string | null
          google_search_console?: string | null
          google_site_verification?: string | null
          gtm_id?: string | null
          hotjar_id?: string | null
          id?: number
          linkedin_partner_id?: string | null
          meta_capi_token?: string | null
          meta_domain_verification?: string | null
          meta_pixel_id?: string | null
          meta_test_event_code?: string | null
          pinterest_tag_id?: string | null
          robots_txt?: string | null
          schema_markup?: string | null
          sitemap_xml?: string | null
          snapchat_pixel_id?: string | null
          tiktok_pixel_id?: string | null
          twitter_pixel_id?: string | null
          updated_at?: string
        }
        Update: {
          clarity_id?: string | null
          created_at?: string
          custom_body_scripts?: string | null
          custom_css?: string | null
          custom_head_scripts?: string | null
          custom_js?: string | null
          enabled?: boolean
          ga4_id?: string | null
          google_ads_conversion_id?: string | null
          google_ads_label?: string | null
          google_search_console?: string | null
          google_site_verification?: string | null
          gtm_id?: string | null
          hotjar_id?: string | null
          id?: number
          linkedin_partner_id?: string | null
          meta_capi_token?: string | null
          meta_domain_verification?: string | null
          meta_pixel_id?: string | null
          meta_test_event_code?: string | null
          pinterest_tag_id?: string | null
          robots_txt?: string | null
          schema_markup?: string | null
          sitemap_xml?: string | null
          snapchat_pixel_id?: string | null
          tiktok_pixel_id?: string | null
          twitter_pixel_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      team_members_public: {
        Row: {
          bio: string | null
          created_at: string | null
          enabled: boolean | null
          facebook_url: string | null
          id: string | null
          instagram_url: string | null
          linkedin_url: string | null
          name: string | null
          photo_url: string | null
          role: string | null
          sort_order: number | null
          twitter_url: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          enabled?: boolean | null
          facebook_url?: string | null
          id?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          name?: string | null
          photo_url?: string | null
          role?: string | null
          sort_order?: number | null
          twitter_url?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          enabled?: boolean | null
          facebook_url?: string | null
          id?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          name?: string | null
          photo_url?: string | null
          role?: string | null
          sort_order?: number | null
          twitter_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
      lead_status:
        | "new"
        | "contacted"
        | "proposal_sent"
        | "closed_won"
        | "closed_lost"
      post_status: "draft" | "published"
      project_status: "planning" | "in_progress" | "review" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
      lead_status: [
        "new",
        "contacted",
        "proposal_sent",
        "closed_won",
        "closed_lost",
      ],
      post_status: ["draft", "published"],
      project_status: ["planning", "in_progress", "review", "completed"],
    },
  },
} as const
