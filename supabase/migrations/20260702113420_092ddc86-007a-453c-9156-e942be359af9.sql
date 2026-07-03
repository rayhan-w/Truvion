
INSERT INTO public.site_content (section, key, label, input_type, value_text, sort_order) VALUES
('footer', 'tagline', 'Tagline', 'textarea', 'Building Bangladesh''s Digital Future — one brand at a time.', 10),
('footer', 'copyright', 'Copyright line', 'text', '© 2025 Truvion Tech. All Rights Reserved.', 20),
('footer', 'contact_email', 'Contact email', 'text', 'hello@truviontech.com', 30),
('footer', 'contact_phone', 'Contact phone', 'text', '+880 1XXX XXXXXX', 40),
('footer', 'contact_address', 'Contact address', 'text', 'Dhaka, Bangladesh', 50),
('footer', 'contact_title', 'Contact column title', 'text', 'Contact', 60),
('footer', 'quick_links_title', 'Quick links column title', 'text', 'Quick Links', 70),
('footer', 'link1_label', 'Quick link 1 label', 'text', 'Home', 71),
('footer', 'link1_href', 'Quick link 1 href', 'text', '#home', 72),
('footer', 'link2_label', 'Quick link 2 label', 'text', 'Services', 73),
('footer', 'link2_href', 'Quick link 2 href', 'text', '#services', 74),
('footer', 'link3_label', 'Quick link 3 label', 'text', 'Portfolio', 75),
('footer', 'link3_href', 'Quick link 3 href', 'text', '#portfolio', 76),
('footer', 'link4_label', 'Quick link 4 label', 'text', 'Pricing', 77),
('footer', 'link4_href', 'Quick link 4 href', 'text', '#pricing', 78),
('footer', 'facebook_url', 'Facebook URL', 'url', '', 80),
('footer', 'linkedin_url', 'LinkedIn URL', 'url', '', 81),
('footer', 'instagram_url', 'Instagram URL', 'url', '', 82),
('footer', 'twitter_url', 'Twitter/X URL', 'url', '', 83),
('footer', 'youtube_url', 'YouTube URL', 'url', '', 84),
('footer', 'whatsapp_url', 'WhatsApp URL', 'url', '', 85)
ON CONFLICT DO NOTHING;
