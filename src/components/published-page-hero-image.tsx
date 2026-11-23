import {getPublishedPageContent} from "@/lib/page-content";
export async function PublishedPageHeroImage({pageKey}:{pageKey:string}){const data=await getPublishedPageContent(pageKey);if(!data?.heroImage)return null;return <figure className="published-media-hero"><img src={data.heroImage} alt={data.heroImageAlt||""}/></figure>}
