import { brandDefault } from "../../../../libs/constant";

// email default props
export const emailDefaultProps = {
    brand_name: brandDefault.name,
    logo_url: `${process.env.BASE_LIVE_URL}/${brandDefault.logo}`,

    facebook_url: brandDefault.url.facebook_page,
    facebook_icon: `${process.env.BASE_LIVE_URL}/${brandDefault.icon.facebook}`,

    linkedin_url: brandDefault.url.linkedin_page,
    linkedin_icon: `${process.env.BASE_LIVE_URL}/${brandDefault.icon.linkedin}`,

    instagram_url: brandDefault.url.instagram_page,
    instagram_icon: `${process.env.BASE_LIVE_URL}/${brandDefault.icon.instagram}`,

    app_store_url: brandDefault.url.app_store,
    app_store_icon: `${process.env.BASE_LIVE_URL}/${brandDefault.icon.app_store}`,

    google_play_url: brandDefault.url.play_store,
    google_play_icon: `${process.env.BASE_LIVE_URL}/${brandDefault.icon.google_play}`,

    address: brandDefault.address,
    support_email: brandDefault.support_email,
}