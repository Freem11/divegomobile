
export enum PHOTO_SIZES {
    Small = "sm",
    Medium = "md",
    Large = "lg",
    ExtraLarge = "xl"
}

export type PhotoVariantSet = {
    original_image: string
    public_domain: string
    sm: string
    md: string
    lg: string
    xl: string
};