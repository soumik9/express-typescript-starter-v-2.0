// email_styles.ts
export const CommonEmailStyles = {
    // --- Global & Layout ---
    body: `font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC !important; margin: 0; padding: 40px 20px; -webkit-font-smoothing: antialiased;`,
    container: `max-width: 520px; margin: 0 auto; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03); border: 1px solid #E2E8F0;`,
    brand_header: `text-align: center; padding: 40px 24px 0 24px;`,
    brand_header_img: `max-width: 140px; height: auto; display: inline-block; border: none; outline: none;`,
    content_wrap: `padding: 32px 40px 48px 40px; text-align: center;`,

    // --- Typography ---
    h1: `font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 16px 0; letter-spacing: -0.5px;`,
    p: `font-size: 16px; line-height: 1.6; color: #334155; margin: 0 0 24px 0;`,
    p_small: `font-size: 14px; line-height: 1.6; color: #64748B; margin: 0;`,
    strong: `color: #0F172A; font-weight: 600;`,
    link: `color: #2563EB; text-decoration: none; font-weight: 600; padding-bottom: 2px; border-bottom: 2px solid #DBEAFE;`,

    // --- Components ---
    divider: `border-top: 1px solid #F1F5F9; margin: 32px 0;`,

    // The "eSIM / Ticket" Box (Using a softer Indigo background)
    ticket_container: `background-color: #F5F3FF; border: 2px dashed #C4B5FD; border-radius: 16px; padding: 24px; margin: 32px 0;`,
    ticket_label: `font-size: 11px; font-weight: 700; color: #7C3AED; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px 0;`,
    otp_code: `font-size: 42px; font-weight: 800; color: #4F46E5; letter-spacing: 12px; margin: 0; text-indent: 12px;`,

    // Information Box
    info_box: `background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: left;`,
    info_label: `font-size: 12px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px 0; display: block;`,
    info_value: `font-size: 16px; font-weight: 600; color: #1E293B; margin: 0 0 16px 0; display: block; word-break: break-all;`,

    // Primary Button (Indigo Theme)
    button_wrap: `margin: 32px 0; text-align: center;`,
    button: `display: inline-block; background-color: #4F46E5; color: #FFFFFF; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 32px; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);`,

    // Alert/Security Box
    alert_box: `background-color: #FFF1F2; border-left: 4px solid #F43F5E; padding: 16px; border-radius: 4px; text-align: left; font-size: 14px; color: #9F1239; margin: 24px 0; line-height: 1.5;`,

    // --- Footer ---
    footer_wrap: `max-width: 520px; margin: 32px auto 0 auto; text-align: center;`,
    address: `font-size: 12px; color: #94A3B8; margin: 0 0 24px 0; line-height: 1.6;`,
    social_icons_container: `margin-bottom: 24px;`,
    social_icon: `width: 32px; height: 32px; display: inline-block; vertical-align: middle;`,
    app_links_container: `margin-bottom: 24px;`,
    app_store_icon: `height: 36px; width: auto; display: inline-block; vertical-align: middle;`,
    google_play_icon: `height: 36px; width: auto; display: inline-block; vertical-align: middle;`,
};