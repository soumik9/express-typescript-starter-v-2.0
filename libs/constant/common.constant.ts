import { FnFileReturnTypeEnum } from "../enum";

export const props = [];

export const defaultImagePath = `public/default/default.png`;

//  Brand default info
export const brandDefault = {
    name: "Brand",
    address: "",
    logo: "public/default/logo.png",
    support_email: "brand@abc.com",

    url: {
        facebook_page: "#",
        linkedin_page: "#",
        instagram_page: "#",
        app_store: "#",
        play_store: "#",
    },
    icon: {
        facebook: "public/default/facebook.png",
        linkedin: "public/default/linkedin.png",
        instagram: "public/default/instagram.png",

        app_store: "public/default/app_store.png",
        google_play: "public/default/google_play.png",
    }
}

export const fileMappings = [
    { key: "image", type: FnFileReturnTypeEnum.Single, field: "single" },
    { key: "cover_image", type: FnFileReturnTypeEnum.Single, field: "cover_single" },
];