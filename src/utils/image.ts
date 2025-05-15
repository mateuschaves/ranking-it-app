import constants from "~/config/consts";

export function getImageUrl(imageName: string | null | undefined): string {
    if (!imageName) {
        return '';
    }

    return `${constants.bucketUrl}/${imageName}`;
}